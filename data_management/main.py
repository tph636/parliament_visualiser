import argparse
import importlib
import os

def main():
    parser = argparse.ArgumentParser(description="Data Management CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Subcommand for downloading images
    parser_download_images = subparsers.add_parser('download_images', help='Download images from the web')
    parser_download_images.set_defaults(func='asset_tools.download_images.main')

    # Subcommand for downloading documents
    parser_download_images = subparsers.add_parser('download_documents_2024', help='Download 2024 PTK documents from the web')
    parser_download_images.set_defaults(func='asset_tools.download_documents_2024.main')

    # Dynamically add subcommands for each update file in db_ops
    for filename in os.listdir('db_ops'):
        if filename.endswith('.py') and filename.startswith('update'):
            module_name = filename[:-3]
            parser_update = subparsers.add_parser(module_name, help=f'Run {module_name} update script')
            parser_update.set_defaults(func=f'db_ops.{module_name}.main')

    # Parse and execute
    args = parser.parse_args()

    # Dynamically import and call the function
    module_path, func_name = args.func.rsplit('.', 1)
    module = importlib.import_module(module_path)
    func = getattr(module, func_name)
    func(args)

if __name__ == "__main__":
    main()