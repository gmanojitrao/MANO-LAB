"""
OmniScribe - Artisan Intelligence & Cross-Folder Aggregator
Automatically identifies artisans and interview sections across single or multiple folders,
groups recordings by artisan, and enables 1-click individual and bulk artisan dossiers.
"""

import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


def natural_sort_key(s: Any) -> list:
    """Sorts strings containing numbers in human natural order (e.g. Section 1, Section 2, Section 10)."""
    return [int(text) if text.isdigit() else str(text).lower() for text in re.split(r'(\d+)', str(s))]


def extract_artisan_and_section(
    file_path_or_name: str,
    ai_artisan: Optional[str] = None,
    ai_section: Optional[str] = None
) -> Tuple[str, str]:
    """
    Intelligently extracts the Artisan / Interviewee Name and the Section / Topic
    from file paths, folder names, and AI detection hints.
    
    Examples:
      - 'Section A - Deepak Prajapati .m4a' -> ('Deepak Prajapati', 'Section A')
      - 'Section B- Priya Jethwani .m4a'   -> ('Priya Jethwani', 'Section B')
      - 'Section-R Nayana Bamaniya .m4a'   -> ('Nayana Bamaniya', 'Section R')
      - 'Interviewer 1/Manoj Ram/Section 2.wav' -> ('Manoj Ram', 'Section 2')
      - 'Manoj Ram - Section 1.mp3'        -> ('Manoj Ram', 'Section 1')
    """
    p = Path(file_path_or_name)
    raw_stem = p.stem.strip()
    
    # Clean up common artifacts (e.g. leading numbers from batch indices like '01_Section_A_-_Deepak_Prajapati_')
    cleaned_stem = re.sub(r'^\d{2,3}[_\- ]+', '', raw_stem).strip()
    cleaned_stem = cleaned_stem.replace('_', ' ')
    cleaned_stem = re.sub(r'\s+', ' ', cleaned_stem).strip()

    extracted_artisan = ""
    extracted_section = ""

    # Pattern 1: Section <X> [- / :] <Artisan Name>
    # e.g., 'Section A - Deepak Prajapati', 'Section-R Nayana Bamaniya'
    m1 = re.match(r'^(Section[-_ ]*[A-Za-z0-9]+)\s*[-_ :]*\s*(.*)$', cleaned_stem, re.IGNORECASE)
    if m1 and m1.group(2).strip():
        extracted_section = m1.group(1).strip()
        extracted_artisan = m1.group(2).strip()

    # Pattern 2: <Artisan Name> [- / :] Section <X>
    # e.g., 'Deepak Prajapati - Section A', 'Manoj Ram Section 1'
    if not extracted_artisan:
        m2 = re.match(r'^(.*?)\s*[-_ :]*\s*(Section[-_ ]*[A-Za-z0-9]+)$', cleaned_stem, re.IGNORECASE)
        if m2 and m2.group(1).strip():
            extracted_artisan = m2.group(1).strip()
            extracted_section = m2.group(2).strip()

    # Pattern 2b: <Artisan Name> [- / :] [Location] Q&A / QA / Q A <X>
    # e.g., 'SATYAJIT PAL GHURNI Q A 2', 'SHIBU BISWAS Q A 1', 'SATYAJIT PAL Q A'
    if not extracted_artisan:
        m2b = re.match(
            r'^(.*?)\s+((?:(?:Ghurni|Nizamabad|Azamgarh|Krishnanagar|Kolkata|Section|Part)\s+)?Q\s*[-_& ]*A(?:\s*\d+)?)\s*$',
            cleaned_stem,
            re.IGNORECASE
        )
        if m2b and m2b.group(1).strip():
            extracted_artisan = m2b.group(1).strip()
            extracted_section = m2b.group(2).strip()

    # Pattern 3: Part <X>
    if not extracted_artisan:
        m3 = re.match(r'^(Part[-_ ]*[A-Za-z0-9]+)\s*[-_ :]*\s*(.*)$', cleaned_stem, re.IGNORECASE)
        if m3 and m3.group(2).strip():
            extracted_section = m3.group(1).strip()
            extracted_artisan = m3.group(2).strip()

    # Pattern 4: Check parent folder if available (e.g. 'Deepak Prajapati / Section A.m4a')
    if not extracted_artisan and p.parent and p.parent.name:
        parent_name = p.parent.name.strip()
        if not parent_name.startswith(('upload_', 'temp_', 'transcriptions_', 'chunk_')):
            extracted_artisan = parent_name
            extracted_section = cleaned_stem

    # Fallback to AI hints if regex was incomplete
    if (not extracted_artisan or extracted_artisan.lower() in ["artisan", "interviewee", "speaker"]) and ai_artisan:
        extracted_artisan = ai_artisan.strip()
    if not extracted_section and ai_section:
        extracted_section = ai_section.strip()

    # If still not found, use cleaned stem
    if not extracted_artisan:
        extracted_artisan = cleaned_stem
    if not extracted_section:
        extracted_section = "General Interview"

    # Normalize section (e.g., 'Section-R' -> 'Section R', 'section a' -> 'Section A')
    extracted_section = re.sub(r'[-_ ]+', ' ', extracted_section).strip().title()

    # Clean artisan name: remove trailing punctuation/hyphens, normalize whitespace
    extracted_artisan = re.sub(r'^[_\- :]+|[_\- :]+$', '', extracted_artisan).strip()
    extracted_artisan = re.sub(r'\s+', ' ', extracted_artisan)
    
    # Title Case artisan name (e.g. 'SATYAJIT PAL' -> 'Satyajit Pal')
    words = extracted_artisan.split(' ')
    extracted_artisan = ' '.join(w.capitalize() for w in words)

    return extracted_artisan, extracted_section


def group_results_by_artisan(results: List[Any]) -> Dict[str, List[Any]]:
    """
    Groups a list of TranscriptionResults by artisan_name,
    sorting their sections in natural order.
    """
    groups: Dict[str, List[Any]] = {}

    for r in results:
        artisan = getattr(r, 'artisan_name', None)
        if not artisan:
            # Try from metadata or filename
            meta = getattr(r, 'metadata', {}) or {}
            artisan = meta.get('artisan_name')
        if not artisan:
            artisan, sec = extract_artisan_and_section(getattr(r, 'filename', 'Unknown'))
            if hasattr(r, 'artisan_name'):
                r.artisan_name = artisan
            if hasattr(r, 'section_name'):
                r.section_name = sec
            if hasattr(r, 'metadata') and isinstance(r.metadata, dict):
                r.metadata['artisan_name'] = artisan
                r.metadata['section_name'] = sec

        if artisan not in groups:
            groups[artisan] = []
        groups[artisan].append(r)

    # Sort sections naturally for each artisan
    for artisan in groups:
        groups[artisan].sort(key=lambda item: natural_sort_key(getattr(item, 'section_name', '') or getattr(item, 'filename', '')))

    # Return sorted by artisan name
    return dict(sorted(groups.items(), key=lambda kv: natural_sort_key(kv[0])))
