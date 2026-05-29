import unreal

editor_asset_lib = unreal.EditorAssetLibrary()
editor_asset_subsystem = unreal.get_editor_subsystem(unreal.EditorAssetSubsystem)

def list_assets(directory="/Game/", recursive=True):
    return editor_asset_lib.list_assets(directory, recursive, False)

def get_asset_info(asset_path):
    return editor_asset_lib.find_package_referencers_for_asset(asset_path)

def search_assets(search_string, search_path="/Game/"):
    all_assets = list_assets(search_path, True)
    return [a for a in all_assets if search_string.lower() in a.lower()]

def rename_asset(old_path, new_path):
    return editor_asset_lib.rename_asset(old_path, new_path)

def delete_asset(asset_path):
    return editor_asset_lib.delete_asset(asset_path)

def duplicate_asset(source_path, dest_path):
    return editor_asset_lib.duplicate_asset(source_path, dest_path)

def save_asset(asset_path, only_if_is_dirty=True):
    return editor_asset_lib.save_asset(asset_path, only_if_is_dirty)

def save_directory(directory_path, only_if_is_dirty=True):
    return editor_asset_lib.save_directory(directory_path, only_if_is_dirty, True)

def import_asset(source_file, dest_path):
    task = unreal.AssetImportTask()
    task.set_editor_property("filename", source_file)
    task.set_editor_property("destination_path", dest_path)
    task.set_editor_property("replace_existing", True)
    task.set_editor_property("automated", True)
    task.set_editor_property("save", True)
    unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
    return task

def export_asset(asset_path, export_path):
    return editor_asset_lib.export_asset(asset_path, export_path)

def validate_assets(asset_paths):
    results = []
    for path in asset_paths:
        errors = editor_asset_lib.validate_assets([path])
        results.append({"path": path, "errors": errors})
    return results

if __name__ == "__main__":
    assets = list_assets("/Game/")
    unreal.log(f"Assets in /Game/: {len(assets)}")
    for a in assets[:10]:
        unreal.log(f"  {a}")
