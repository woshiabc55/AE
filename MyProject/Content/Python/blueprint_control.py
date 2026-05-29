import unreal

def create_blueprint(blueprint_name, parent_class="/Script/Engine.Actor", save_path="/Game/Blueprints"):
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    factory = unreal.BlueprintFactory()
    factory.set_editor_property("parent_class", unreal.load_class(None, parent_class))
    bp = asset_tools.create_asset(blueprint_name, save_path, unreal.Blueprint, factory)
    return bp

def compile_blueprint(blueprint):
    unreal.KismetSystemLibrary.compile_blueprint(blueprint)

def add_variable_to_blueprint(blueprint, var_name, var_type, default_value=None):
    fsm = blueprint.get_editor_property("function_graphs")
    pass

def spawn_blueprint_instance(blueprint_path, location, rotation=None, actor_label=None):
    actor_class = unreal.load_class(None, blueprint_path)
    if not actor_class:
        unreal.log_error(f"Failed to load blueprint class: {blueprint_path}")
        return None
    subsystem = unreal.get_editor_subsystem(unreal.EditorLevelSubsystem)
    location_vec = unreal.Vector(x=location[0], y=location[1], z=location[2])
    rotator = unreal.Rotator()
    if rotation:
        rotator = unreal.Rotator(pitch=rotation[0], yaw=rotation[1], roll=rotation[2])
    actor = subsystem.spawn_actor_from_class(actor_class, location_vec, rotator)
    if actor_label and actor:
        actor.set_actor_label(actor_label)
    return actor

if __name__ == "__main__":
    bp = create_blueprint("BP_TestActor", "/Script/Engine.Actor", "/Game/Blueprints")
    if bp:
        unreal.log(f"Created blueprint: {bp.get_path_name()}")
