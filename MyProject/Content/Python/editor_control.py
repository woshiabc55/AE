import unreal

def take_screenshot(filename, resolution=None, camera=None):
    automation = unreal.AutomationLibrary
    if resolution:
        unreal.SystemLibrary.execute_console_command(None, f"r.SetRes {resolution[0]}x{resolution[1]}")
    if camera:
        set_viewport_camera(camera.get_actor_location(), camera.get_actor_rotation())
    unreal.SystemLibrary.execute_console_command(None, f"HighResShot {filename}")

def set_viewport_camera(location, rotation):
    subsystem = unreal.get_editor_subsystem(unreal.EditorLevelSubsystem)
    unreal.EditorLevelLibrary.set_pivot_location_for_orbit(location, False)

def run_console_command(command):
    unreal.SystemLibrary.execute_console_command(None, command)

def get_engine_info():
    return {
        "version": unreal.SystemLibrary.get_engine_version(),
        "project_name": unreal.Paths.get_project_file_path(),
    }

def save_current_level():
    return unreal.EditorLevelLibrary.save_current_level()

def load_level(level_path):
    unreal.EditorLevelLibrary.load_level(level_path)

def get_current_level_info():
    world = unreal.EditorLevelLibrary.get_editor_world()
    if world:
        return {
            "name": world.get_name(),
            "path": world.get_path_name(),
        }
    return None

def new_level(level_path):
    unreal.EditorLevelLibrary.new_level(level_path)

def get_viewport_screenshot():
    import json
    import urllib.request
    url = "http://127.0.0.1:30010/remote/object/call"
    payload = {
        "objectPath": "/Script/EditorScripting.Default__EditorLevelLibrary",
        "functionName": "GetEditorWorld",
        "parameters": {},
        "generateTransaction": False
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PUT"
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except:
        return None

if __name__ == "__main__":
    info = get_engine_info()
    unreal.log(f"Engine: {info['version']}")
    level_info = get_current_level_info()
    if level_info:
        unreal.log(f"Current Level: {level_info['name']}")
