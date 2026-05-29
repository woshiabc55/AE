import unreal

def get_property(object_path, property_name):
    system_lib = unreal.SystemLibrary()
    remote_control = unreal.RemoteControlPreset
    data = unreal.EditorLevelLibrary
    return None

def set_property_by_remote_control(object_path, property_name, property_value):
    import json
    import urllib.request

    url = "http://127.0.0.1:30010/remote/object/property"
    payload = {
        "objectPath": object_path,
        "property": property_name,
        "value": property_value,
        "generateTransaction": True
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
    except Exception as e:
        unreal.log_error(f"Remote Control set_property failed: {e}")
        return None

def call_function_by_remote_control(object_path, function_name, parameters=None, generate_transaction=True):
    import json
    import urllib.request

    url = "http://127.0.0.1:30010/remote/object/call"
    payload = {
        "objectPath": object_path,
        "functionName": function_name,
        "parameters": parameters or {},
        "generateTransaction": generate_transaction
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
    except Exception as e:
        unreal.log_error(f"Remote Control call_function failed: {e}")
        return None

def batch_remote_control(requests_list):
    import json
    import urllib.request

    url = "http://127.0.0.1:30010/remote/batch"
    payload = {"requests": requests_list}
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PUT"
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        unreal.log_error(f"Remote Control batch failed: {e}")
        return None

def get_remote_info():
    import json
    import urllib.request

    url = "http://127.0.0.1:30010/remote/info"
    try:
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        unreal.log_error(f"Remote Control get_info failed: {e}")
        return None

def query_remote_objects(object_paths):
    import json
    import urllib.request

    url = "http://127.0.0.1:30010/remote/object/query"
    payload = {"objectPaths": object_paths}
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PUT"
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        unreal.log_error(f"Remote Control query failed: {e}")
        return None

if __name__ == "__main__":
    info = get_remote_info()
    if info:
        unreal.log("Remote Control API connected successfully!")
        unreal.log(f"Available routes: {len(info.get('HttpRoutes', []))}")
    else:
        unreal.log_warning("Remote Control API not available. Make sure the plugin is enabled.")
