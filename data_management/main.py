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

    # Subcommand for updating member of parliament
    parser_update_member = subparsers.add_parser('update_member_of_parliament', help='Update member of parliament data')
    parser_update_member.set_defaults(func='db_ops.update_member_of_parliament.main')

    # Subcommand for updating seating of parliament
    parser_update_seating = subparsers.add_parser('update_seating_of_parliament', help='Update seating of parliament data')
    parser_update_seating.set_defaults(func='db_ops.update_seating_of_parliament.main')

    # Subcommand for updating valihuudot
    parser_update_valihuudot = subparsers.add_parser('update_valihuudot', help='Update valihuudot data')
    parser_update_valihuudot.set_defaults(func='db_ops.update_valihuudot.main')

    # Parse and execute
    args = parser.parse_args()

    # Dynamically import and call the function
    module_path, func_name = args.func.rsplit('.', 1)
    module = importlib.import_module(module_path)
    func = getattr(module, func_name)
    func(args)

if __name__ == "__main__":
    main()