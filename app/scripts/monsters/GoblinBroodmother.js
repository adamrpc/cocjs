'use strict';

angular.module( 'cocjs' ).factory( 'GoblinBroodmother', function( SceneLib, MainView, Goblin, AppearanceDefs, WeightedDrop, ConsumableLib, Appearance, EngineCore, Monster, Utils, StatusAffects ) {
	function GoblinBroodmother() {
		this.init(this, arguments);
	}
	angular.extend(GoblinBroodmother.prototype, Goblin.prototype);
	GoblinBroodmother.prototype.defeated = function() {
		MainView.clearOutput();
		MainView.outputText( 'The goblin broodmother is defeated!  You find a bottle of succubi milk on her.  That stuff is banned in Tel\'Adre - and for good reason, but it might come in handy.  You pocket the foul fluid for now.' );
		MainView.outputText( '  You could use her for a quick, willing fuck to sate your lusts before continuing on.  Do you?' );
		MainView.menu();
		EngineCore.addButton( 0, 'Fuck', SceneLib.urtaQuest, SceneLib.urtaQuest.winFuckAGoblinBroodmotherAsUrta );
		EngineCore.addButton( 4, 'Leave', SceneLib.urtaQuest, SceneLib.urtaQuest.nagaPleaseNagaStoleMyDick );
	};
	GoblinBroodmother.prototype.won = function() {
		SceneLib.urtaQuest.urtaLosesToGoblin();
	};
	GoblinBroodmother.prototype.init = function( that ) {
		Goblin.prototype.init( that, [ true ] );
		that.classNames.push('GoblinBroodmother');
		that.a = 'the ';
		that.short = 'goblin broodmother';
		that.imageName = 'goblin';
		that.long = 'Thanks to their corruption, it\'s almost impossible to discern a goblin\'s age by their appearance, but it\'s quite obvious that this one is no horny young slut looking for her first dozen or so studs.  Standing before you is an obvious veteran breeder, a proud motherwhore who doubtlessly has a sizable tribe of slutty daughters somewhere not too far away.  Maybe three and a half feet tall, she has vibrant yellow skin - a rare shade, for goblins - and a wild mane of flamboyant neon pink and neon blue striped hair that falls down her back, her long, pointed ears barely visible amongst it.  Her many pregnancies have rendered her absurdly voluptuous. I-cup tits wobble absurdly in the air before her, their jiggling expanse so big that it\'s a wonder she can reach out to her blatant, teat-like purple nipples. Broodmother hips flare out from her waist, making her sashay from side to side with every step. A gloriously round and luscious bubble-butt, big enough to be DD-cup tits if it were on somebody\'s chest, jiggles enticingly with every motion.  Lewd leather straps fight to contain her exaggerated boobs and ass, serving more to house clinking pouches and bottles than to provide any protection of her modesty.  Piercings stud her lips, nose, eyebrows, ears, nipples and clit, and her fiery red eyes smoulder as she seductively licks her lips at you.\n\nYour treacherous horse-cock aches to bury itself into this ripe, ready slut, but you have to be strong - you rather doubt she\'ll let you go with a single fuck, even if you are incapable of giving her the babies she craves...';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 30, 0, 0, 0 );
		that.tallness = 35 + Utils.rand( 4 );
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'dark green';
		that.hairColor = 'purple';
		that.hairLength = 4;
		that.initStrTouSpeInte( 50, 30, 35, 100 );
		that.initLibSensCor( 70, 20, 70 );
		that.weaponName = 'fists';
		that.weaponVerb = 'tiny punch';
		that.weaponAttack = 20;
		that.armorName = 'leather straps';
		that.bonusHP = 300;
		that.lust = 50;
		that.lustVuln = 0.5;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 10;
		that.gems = Utils.rand( 5 ) + 5;
		that.drop = new WeightedDrop().add( ConsumableLib.GOB_ALE, 5 ).addMany( 1, ConsumableLib.L_DRAFT,
			ConsumableLib.PINKDYE,
			ConsumableLib.BLUEDYE,
			ConsumableLib.ORANGDY,
			ConsumableLib.PURPDYE );
		that.special1 = that.goblinDrugAttack;
		that.special2 = that.goblinTeaseAttack;
		that.checkMonster();
	};
	return GoblinBroodmother;
} );