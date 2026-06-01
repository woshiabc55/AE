var project = app.project;

function createCompositions() {
    var mainComp = project.items.addComp("MAIN_TIMELINE", 1920, 1080, 1, 180, 30);
    mainComp.comment = "主时间线 - 总时长6秒";

    var chaosComp = createChaosSpaceScene();
    var voiceComp = createVoiceScene();
    var monsterComp = createMonsterScene();

    var chaosLayer = mainComp.layers.add(chaosComp);
    chaosLayer.name = "SCENE_01_混沌空间战斗";
    chaosLayer.startTime = 0;

    var voiceLayer = mainComp.layers.add(voiceComp);
    voiceLayer.name = "SCENE_02_神人好声音";
    voiceLayer.startTime = 30;

    var monsterLayer = mainComp.layers.add(monsterComp);
    monsterLayer.name = "SCENE_03_巨兽撞击";
    monsterLayer.startTime = 90;

    var timecodeLayer = mainComp.layers.addText("TIMECODE");
    timecodeLayer.name = "TIMECODE_OVERLAY";
    timecodeLayer.startTime = 0;
    var textProp = timecodeLayer.property("Source Text");
    textProp.setValue("00:00:00:00");

    alert("AE项目创建完成！\n\n项目结构：\n- MAIN_TIMELINE (1920x1080, 30fps, 6秒)\n  - SCENE_01_混沌空间战斗 (0-1秒)\n  - SCENE_02_神人好声音 (1-3秒)\n  - SCENE_03_巨兽撞击 (3-6秒)\n  - TIMECODE_OVERLAY");
}

function createChaosSpaceScene() {
    var comp = app.project.items.addComp("SCENE_01_混沌空间战斗", 1920, 1080, 1, 30, 30);
    comp.comment = "场景1：战士在混沌空间战斗 | 时长：0-1秒";

    var bgLayer = comp.layers.addSolid([0, 0, 0], "BG_混沌空间", 1920, 1080, 1);
    bgLayer.name = "BG_混沌空间";

    var warriorLayer = comp.layers.addSolid([255, 255, 255], "CHAR_战士", 100, 300, 1);
    warriorLayer.name = "CHAR_战士";
    warriorLayer.position.setValue([960, 540]);

    var effect1 = warriorLayer.Effects.addProperty("Gaussian Blur");
    effect1.property("Blurriness").setValueAtTime(0, 10);
    effect1.property("Blurriness").setValueAtTime(5, 0);

    var debrisLayer = comp.layers.addSolid([100, 100, 100], "EFFECT_碎片", 1920, 1080, 1);
    debrisLayer.name = "EFFECT_模糊碎片";
    debrisLayer.opacity.setValueAtTime(0, 100);
    debrisLayer.opacity.setValueAtTime(15, 0);

    var shakeEffect = comp.activeCamera.Effects.addProperty("Shake");
    shakeEffect.property("Amount").setValueAtTime(0, 20);
    shakeEffect.property("Amount").setValueAtTime(10, 0);

    return comp;
}

function createVoiceScene() {
    var comp = app.project.items.addComp("SCENE_02_神人好声音", 1920, 1080, 1, 60, 30);
    comp.comment = "场景2：神人好声音导师入场 | 时长：1-3秒";

    var stageLayer = comp.layers.addSolid([50, 0, 100], "BG_舞台", 1920, 1080, 1);
    stageLayer.name = "BG_舞台";

    var mentor1 = comp.layers.addSolid([255, 0, 0], "CHAR_导师1", 150, 400, 1);
    mentor1.name = "CHAR_导师1_papa";
    mentor1.position.setValueAtTime(0, [-200, 540]);
    mentor1.position.setValueAtTime(10, [480, 540]);

    var maskLayer = comp.layers.addSolid([0, 0, 0], "MASK_黑场", 1920, 1080, 1);
    maskLayer.name = "MASK_黑场";
    maskLayer.opacity.setValueAtTime(0, 100);
    maskLayer.opacity.setValueAtTime(5, 0);

    var kaleidoEffect = stageLayer.Effects.addProperty("Kaleidoscope");
    kaleidoEffect.property("Sides").setValue(6);

    return comp;
}

function createMonsterScene() {
    var comp = app.project.items.addComp("SCENE_03_巨兽撞击", 1920, 1080, 1, 90, 30);
    comp.comment = "场景3：巨兽撞击与角色反击 | 时长：3-6秒";

    var cityLayer = comp.layers.addSolid([30, 30, 50], "BG_废墟城市", 1920, 1080, 1);
    cityLayer.name = "BG_废墟城市";

    var monsterLayer = comp.layers.addSolid([80, 80, 80], "CHAR_巨兽", 800, 600, 1);
    monsterLayer.name = "CHAR_巨兽";
    monsterLayer.position.setValueAtTime(0, [2000, 700]);
    monsterLayer.position.setValueAtTime(20, [960, 700]);

    var impactEffect = comp.layers.addSolid([255, 200, 0], "EFFECT_冲击", 1920, 1080, 1);
    impactEffect.name = "EFFECT_冲击";
    impactEffect.opacity.setValueAtTime(18, 0);
    impactEffect.opacity.setValueAtTime(20, 100);
    impactEffect.opacity.setValueAtTime(25, 0);

    var heroLayer = comp.layers.addSolid([0, 200, 255], "CHAR_主角", 80, 250, 1);
    heroLayer.name = "CHAR_主角";
    heroLayer.position.setValueAtTime(30, [960, 800]);
    heroLayer.position.setValueAtTime(45, [960, 300]);

    var cameraShake = comp.activeCamera.Effects.addProperty("Shake");
    cameraShake.property("Amount").setValueAtTime(20, 30);
    cameraShake.property("Amount").setValueAtTime(30, 0);

    return comp;
}

createCompositions();

var outputFile = new File("/workspace/output_project.aep");
app.project.save(outputFile);
