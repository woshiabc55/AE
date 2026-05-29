#!/usr/bin/env python3
import sys
import json
import argparse
import urllib.request
import urllib.error

UE_REMOTE_HOST = "127.0.0.1"
UE_REMOTE_PORT = 30010
BASE_URL = f"http://{UE_REMOTE_HOST}:{UE_REMOTE_PORT}"


def remote_get(path):
    url = f"{BASE_URL}{path}"
    try:
        with urllib.request.urlopen(url) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"ERROR: Cannot connect to UE5 at {url}")
        print(f"  Make sure Unreal Editor is running with Remote Control API enabled.")
        print(f"  Details: {e}")
        sys.exit(1)


def remote_put(path, payload):
    url = f"{BASE_URL}{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"}, method="PUT")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        print(f"ERROR: Request failed: {e}")
        sys.exit(1)


def cmd_info(args):
    result = remote_get("/remote/info")
    print(json.dumps(result, indent=2))


def cmd_ping(args):
    try:
        result = remote_get("/remote/info")
        print(f"OK - UE5 Remote Control API connected (port {UE_REMOTE_PORT})")
        routes = result.get("HttpRoutes", [])
        print(f"  Available routes: {len(routes)}")
    except SystemExit:
        pass


def cmd_list_actors(args):
    payload = {
        "objectPath": "/Script/Engine.Default__EditorLevelLibrary",
        "functionName": "GetAllLevelActors",
        "parameters": {}
    }
    result = remote_put("/remote/object/call", payload)
    print(json.dumps(result, indent=2))


def cmd_spawn(args):
    payload = {
        "objectPath": "/Script/Engine.Default__EditorLevelLibrary",
        "functionName": "SpawnActorFromClass",
        "parameters": {
            "ActorClass": args.class_path,
            "Location": {"X": args.x, "Y": args.y, "Z": args.z}
        },
        "generateTransaction": True
    }
    result = remote_put("/remote/object/call", payload)
    print(json.dumps(result, indent=2))


def cmd_set_property(args):
    payload = {
        "objectPath": args.object_path,
        "property": args.property_name,
        "value": json.loads(args.value),
        "generateTransaction": True
    }
    result = remote_put("/remote/object/property", payload)
    print(json.dumps(result, indent=2))


def cmd_get_property(args):
    payload = {
        "objectPath": args.object_path,
        "property": args.property_name
    }
    result = remote_put("/remote/object/property", payload)
    print(json.dumps(result, indent=2))


def cmd_call(args):
    params = json.loads(args.params) if args.params else {}
    payload = {
        "objectPath": args.object_path,
        "functionName": args.function_name,
        "parameters": params,
        "generateTransaction": True
    }
    result = remote_put("/remote/object/call", payload)
    print(json.dumps(result, indent=2))


def cmd_console(args):
    payload = {
        "objectPath": "/Script/Engine.Default__SystemLibrary",
        "functionName": "ExecuteConsoleCommand",
        "parameters": {
            "Command": args.command
        }
    }
    result = remote_put("/remote/object/call", payload)
    print(json.dumps(result, indent=2))


def cmd_query(args):
    paths = args.object_paths.split(",")
    payload = {"objectPaths": paths}
    result = remote_put("/remote/object/query", payload)
    print(json.dumps(result, indent=2))


def cmd_batch(args):
    with open(args.file, "r") as f:
        requests_list = json.load(f)
    payload = {"requests": requests_list}
    result = remote_put("/remote/batch", payload)
    print(json.dumps(result, indent=2))


def main():
    parser = argparse.ArgumentParser(description="UE5 Remote Control CLI - Take over the Unreal Editor")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    subparsers.add_parser("ping", help="Test connection to UE5")
    subparsers.add_parser("info", help="Get Remote Control API info")

    spawn_p = subparsers.add_parser("spawn", help="Spawn an actor")
    spawn_p.add_argument("--class-path", required=True, help="Actor class path (e.g. /Script/Engine.PointLight)")
    spawn_p.add_argument("--x", type=float, default=0)
    spawn_p.add_argument("--y", type=float, default=0)
    spawn_p.add_argument("--z", type=float, default=0)

    set_p = subparsers.add_parser("set", help="Set a property on an object")
    set_p.add_argument("--object-path", required=True)
    set_p.add_argument("--property-name", required=True)
    set_p.add_argument("--value", required=True, help="JSON value")

    get_p = subparsers.add_parser("get", help="Get a property from an object")
    get_p.add_argument("--object-path", required=True)
    get_p.add_argument("--property-name", required=True)

    call_p = subparsers.add_parser("call", help="Call a function on an object")
    call_p.add_argument("--object-path", required=True)
    call_p.add_argument("--function-name", required=True)
    call_p.add_argument("--params", default=None, help="JSON parameters")

    subparsers.add_parser("list-actors", help="List all actors in current level")

    console_p = subparsers.add_parser("console", help="Execute a console command")
    console_p.add_argument("--command", required=True)

    query_p = subparsers.add_parser("query", help="Query objects by path")
    query_p.add_argument("--object-paths", required=True, help="Comma-separated object paths")

    batch_p = subparsers.add_parser("batch", help="Execute a batch of requests from a JSON file")
    batch_p.add_argument("--file", required=True, help="Path to JSON file with request array")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    commands = {
        "ping": cmd_ping,
        "info": cmd_info,
        "spawn": cmd_spawn,
        "set": cmd_set_property,
        "get": cmd_get_property,
        "call": cmd_call,
        "list-actors": cmd_list_actors,
        "console": cmd_console,
        "query": cmd_query,
        "batch": cmd_batch,
    }

    if args.command in commands:
        commands[args.command](args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
