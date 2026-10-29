"""
OmniScribe - Command Line Interface
Run high-fidelity audio transcription directly from PowerShell / Terminal.
"""

import argparse
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.progress import BarColumn, Progress, SpinnerColumn, TextColumn, TimeElapsedColumn
from rich.table import Table

from batch_orchestrator import BatchOrchestrator, BatchProgress
from config import Config

console = Console()


def print_banner():
    console.print(
        Panel.fit(
            "[bold cyan]🎙️ OmniScribe AI Transcription Suite[/bold cyan]\n"
            "[dim]A-to-Z High-Precision Forensic Audio Transcription & Translation[/dim]\n"
            "[yellow]Outputs: Native Script • English Translation • Romanized (Hinglish/Banglish)[/yellow]",
            border_style="cyan"
        )
    )


def main():
    print_banner()

    parser = argparse.ArgumentParser(description="OmniScribe AI Audio Transcription Tool")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--file", "-f", type=str, help="Path to single audio or video file")
    group.add_argument("--folder", "-d", type=str, help="Path to folder containing audio files")

    parser.add_argument(
        "--engine", "-e",
        choices=["gemini", "groq", "openai", "local"],
        default="gemini",
        help="Transcription engine (default: gemini)"
    )
    parser.add_argument(
        "--denoise",
        choices=["auto", "mild", "aggressive", "none"],
        default="auto",
        help="Noise reduction mode (default: auto)"
    )
    parser.add_argument(
        "--chunk-mins",
        type=float,
        default=10.0,
        help="Maximum chunk duration in minutes before splitting (default: 10.0)"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default=None,
        help="Custom output directory"
    )
    parser.add_argument(
        "--recursive", "-r",
        action="store_true",
        default=True,
        help="Recursively scan subfolders when --folder is provided"
    )
    parser.add_argument("--gemini-key", type=str, default=None, help="Google Gemini API key")
    parser.add_argument("--groq-key", type=str, default=None, help="Groq API key")
    parser.add_argument("--openai-key", type=str, default=None, help="OpenAI API key")

    args = parser.parse_args()

    # Save keys if provided
    if args.gemini_key:
        Config.save_api_key("GEMINI", args.gemini_key)
    if args.groq_key:
        Config.save_api_key("GROQ", args.groq_key)
    if args.openai_key:
        Config.save_api_key("OPENAI", args.openai_key)

    # Resolve target files
    target_files = []
    if args.file:
        p = Path(args.file).resolve()
        if not p.exists():
            console.print(f"[bold red]Error:[/bold red] File not found: {p}")
            sys.exit(1)
        target_files.append(p)
    elif args.folder:
        dir_p = Path(args.folder).resolve()
        if not dir_p.exists() or not dir_p.is_dir():
            console.print(f"[bold red]Error:[/bold red] Folder not found: {dir_p}")
            sys.exit(1)
        target_files = BatchOrchestrator.scan_folder_for_media(dir_p, recursive=args.recursive)
        if not target_files:
            console.print(f"[bold yellow]Warning:[/bold yellow] No supported audio/video files found in: {dir_p}")
            sys.exit(0)

    console.print(f"\n[green]✔[/green] Discovered [bold]{len(target_files)}[/bold] media file(s) to process.")
    console.print(f"[cyan]Engine:[/cyan] {args.engine.upper()} | [cyan]Denoise:[/cyan] {args.denoise} | [cyan]Chunk threshold:[/cyan] {args.chunk_mins} min\n")

    out_dir = Path(args.output).resolve() if args.output else None
    orchestrator = BatchOrchestrator(
        engine_name=args.engine,
        denoise_mode=args.denoise,
        chunk_duration_mins=args.chunk_mins,
        gemini_key=args.gemini_key,
        groq_key=args.groq_key,
        openai_key=args.openai_key,
        output_base_dir=out_dir
    )

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        TimeElapsedColumn(),
        console=console
    ) as progress_bar:
        task = progress_bar.add_task("[cyan]Processing batch...", total=100)

        def on_progress(p: BatchProgress):
            progress_bar.update(
                task,
                completed=p.percent_complete,
                description=f"[cyan]{p.status_message[:55]}..."
            )

        batch_dir, results = orchestrator.process_batch(
            files=target_files,
            batch_title=f"CLI_Batch_{Path(args.file).stem if args.file else Path(args.folder).name}",
            progress_callback=on_progress
        )

    console.print("\n[bold green]🎉 Batch Transcription Successfully Finished![/bold green]")
    console.print(f"[bold]Output Directory:[/bold] [underline]{batch_dir}[/underline]\n")

    # Summary table
    table = Table(title="Transcription Results Summary", header_style="bold magenta")
    table.add_column("#", style="dim", width=4)
    table.add_column("File Name", style="cyan")
    table.add_column("Duration", justify="right")
    table.add_column("Language", style="green")
    table.add_column("Confidence", justify="right")
    table.add_column("Denoised", justify="center")

    for idx, r in enumerate(results, 1):
        table.add_row(
            str(idx),
            r.filename,
            r.duration_formatted,
            r.language_detected,
            f"{int(r.confidence * 100)}%",
            "Yes" if r.denoised else "Clean"
        )

    console.print(table)
    console.print(f"\n[bold]Master Combined Documents Ready:[/bold]")
    console.print(f" • [cyan]Word Document:[/cyan] {batch_dir / 'Master_Combined_Transcript.docx'}")
    console.print(f" • [cyan]Markdown Dossier:[/cyan] {batch_dir / 'Master_Combined_Transcript.md'}")
    console.print(f" • [cyan]Zip Archive:[/cyan] {batch_dir.parent / f'{batch_dir.name}.zip'}")


if __name__ == "__main__":
    main()
