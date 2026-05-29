import unreal

def spawn_actor(actor_class, location, rotation=None, actor_label=None):
    actor_class_path = _resolve_class_path(actor_class)
    subsystem = unreal.get_editor_subsystem(unreal.EditorLevelSubsystem)
    location_vec = unreal.Vector(x=location[0], y=location[1], z=location[2])
    rotator = unreal.Rotator()
    if rotation:
        rotator = unreal.Rotator(pitch=rotation[0], yaw=rotation[1], roll=rotation[2])
    actor = subsystem.spawn_actor_from_class(actor_class_path, location_vec, rotator)
    if actor_label and actor:
        actor.set_actor_label(actor_label)
    return actor

def _resolve_class_path(class_name):
    class_map = {
        "point_light": "/Script/Engine.PointLight",
        "spot_light": "/Script/Engine.SpotLight",
        "directional_light": "/Script/Engine.DirectionalLight",
        "sky_light": "/Script/Engine.SkyLight",
        "camera": "/Script/Engine.CameraActor",
        "cine_camera": "/Script/CinematicCamera.CineCameraActor",
        "static_mesh": "/Script/Engine.StaticMeshActor",
        "sky_sphere": "/Script/Engine.SkyAtmosphere",
        "exponential_height_fog": "/Script/Engine.ExponentialHeightFog",
        "player_start": "/Script/Engine.PlayerStart",
        "target_point": "/Script/Engine.TargetPoint",
        "empty_actor": "/Script/Engine.Actor",
    }
    if class_name in class_map:
        return unreal.load_class(None, class_map[class_name])
    if class_name.startswith("/Script/"):
        return unreal.load_class(None, class_name)
    return unreal.load_class(None, f"/Script/Engine.{class_name}")

def delete_actor(actor):
    subsystem = unreal.get_editor_subsystem(unreal.EditorLevelSubsystem)
    subsystem.destroy_actor(actor)

def get_all_actors():
    subsystem = unreal.get_editor_subsystem(unreal.EditorLevelSubsystem)
    return subsystem.get_all_level_actors()

def get_actors_by_class(class_name):
    actors = get_all_actors()
    class_path = _resolve_class_path(class_name)
    return [a for a in actors if a.get_class() == class_path]

def set_actor_location(actor, location):
    actor.set_actor_location(unreal.Vector(x=location[0], y=location[1], z=location[2]), False, True)

def set_actor_rotation(actor, rotation):
    actor.set_actor_rotation(unreal.Rotator(pitch=rotation[0], yaw=rotation[1], roll=rotation[2]))

def get_actor_transform(actor):
    loc = actor.get_actor_location()
    rot = actor.get_actor_rotation()
    return {
        "location": {"x": loc.x, "y": loc.y, "z": loc.z},
        "rotation": {"pitch": rot.pitch, "yaw": rot.yaw, "roll": rot.roll}
    }

if __name__ == "__main__":
    actors = get_all_actors()
    unreal.log(f"Total actors in level: {len(actors)}")
