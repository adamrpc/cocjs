'use strict';

angular.module( 'cocjs' ).factory( 'Harpy', function( $log, CoC, kFLAGS, EngineCore, Monster, ArmorLib, Utils, AppearanceDefs, StatusAffects, Appearance, ChainedDrop, ConsumableLib, Combat ) {
	var Harpy = angular.copy( Monster );
	//*Note, special attack one is an idea based on Ceraph.
	//About the attack that raises your Lust to 100 if you
	//don't 'wait' when she unleashes it. Alright, I
	//basically used the idea, sorry. But it's a neat idea
	//so it should be fitting, right? Or you could just
	//dump it out altogether. It'd cause severe damage,
	//in the 150 region if you don't wise up.*
	Harpy.prototype.harpyUberCharge = function() {
		//(this.Harpy special attack 1, part one)
		if( this.findStatusAffect( StatusAffects.Uber ) < 0 ) {
			this.createStatusAffect( StatusAffects.Uber, 0, 0, 0, 0 );
			EngineCore.outputText( 'Flapping her wings frantically, she flies away from you and gains height, hanging in the light before you.  She lets out a shrill and terrifying cry, narrowing her eyes as she focuses in on you!', false );
		}
		//(this.Harpy special attack 1, part two if PC does anything but 'Wait')
		else {
			if( CoC.getInstance().flags[ kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG ] === 0 ) {
				var damage = 160 + Utils.rand( 20 );
				damage = CoC.getInstance().player.takeDamage( damage );
				EngineCore.outputText( 'The harpy lets out a terrible cry and drops, reaching an almost impossible speed as she dives down at you.  Her eyes are narrowed like a true bird of prey.  You were too busy with your own attack to avoid it!  Her claws surge down and pierce your ' + CoC.getInstance().player.armorName + ' like paper, driving hard into the flesh beneath and making you cry out in pain.  The harpy dumps you onto the ground, your wounds bleeding profusely. (' + damage + ')', false );
				this.removeStatusAffect( StatusAffects.Uber );
			} else {
				EngineCore.outputText( 'You stand firm and ready yourself as the crazed harpy hovers above you. Letting out an ear-splitting cry she dives at you with her claws extended, reaching an incredible speed before she levels out.  The harpy is heading right for you!  Thanks to your ready position, you manage to dive aside just as the harpy reaches you.  She clips you slightly, spinning you as you dive for the ground.  You hit the ground hard, but look up in time to see her make a rough, graceless landing.  Her body rolls until it reached a standstill.  The enraged harpy drags herself up and takes flight once more!', false );
				CoC.getInstance().player.takeDamage( 10 + Utils.rand( 10 ) );
				this.removeStatusAffect( StatusAffects.Uber );
				this.HP -= 20;
			}
		}
		Combat.combatRoundOver();
	};
	//(this.Harpy special attack 2, lust increase)
	Harpy.prototype.harpyTease = function() {
		EngineCore.outputText( 'The harpy charges at you carelessly, her body striking you with the full weight of her motherly hips.  The pair of you go crashing backwards onto the ground.  You grapple with her weighty ass, trying your best not to think dirty thoughts, but the way she\'s maniacally flapping and writhing her curvy body against you makes it impossible! After a brief, groping wrestle on the ground, she pushes you away and takes flight again.', false );
		EngineCore.dynStats( 'lus', (12 + Utils.rand( CoC.getInstance().player.sens / 5 )) );
		Combat.combatRoundOver();
	};

	Harpy.prototype.performCombatAction = function() {
		if( this.findStatusAffect( StatusAffects.Uber ) >= 0 ) {
			this.harpyUberCharge();
			return;
		}
		super.performCombatAction();
	};
	Harpy.prototype.defeated = function() {
		CoC.getInstance().scenes.harpyScene.harpyVictoryuuuuu();
	};

	Harpy.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foe doesn\'t seem disgusted enough to leave...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			CoC.getInstance().scenes.harpyScene.harpyLossU();
		}
	};
	Harpy.prototype.outputPlayerDodged = function( ) {
		EngineCore.outputText( 'With another deranged cry the harpy dives at you, swinging her razor-sharp talons through the air with the grace of a ballerina. Your quick reflexes allow you to dodge every vicious slash she makes at you.\n', false );
	};
	Harpy.prototype.outputAttack = function( damage ) {
		if( damage <= 0 ) {
			EngineCore.outputText( 'The harpy dives at you with her foot-talons, but you deflect the attack, grasp onto her leg, and swing her through the air, tossing her away from you before she has a chance to right herself.', false );
		} else {
			EngineCore.outputText( 'The harpy surges forward, bringing her razor-sharp claws down on you, tearing at all the exposed flesh she can reach! (' + damage + ')', false );
		}
	};
	Harpy.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		if( args[ 0 ] ) {
			return;
		}
		$log.debug( 'Harpy Constructor!' );
		that.a = 'the ';
		that.short = 'harpy';
		that.imageName = 'harpy';
		that.long = 'You are fighting a tall, deranged harpy. She appears very human, about six feet six inches tall but covered in a fine layer of powder-blue down. Her arms are sinewy and muscular, with a long web connecting them to her ample hips, covered in stringy blue feathers to aid her flight. A larger pair of powdery-blue wings also protrudes from her shoulder blades, flapping idly. She appears quite deranged as she circles you, approaching and backing away erratically. Her face is quite beautiful, with fine lilac makeup adorning the features of a handsome woman, and her lips are traced with rich golden lipstick. As she circles you, squawking frantically and trying to intimidate you, your eyes are drawn to her slender torso and small, pert breasts, each the size of a small fruit and covered in a layer of the softest feathers which ripple and move with the gusts from her wings. As astounding as her breasts are, her egg-bearing hips are even more impressive.  They\'re twice as wide as her torso, with enormous, jiggling buttocks where her huge, meaty thighs are coming up to meet them. Her legs end in three-pronged talons; their shadowy black curves glinting evilly in the light.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 40, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'B' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 20, 0, 0, 0 );
		that.tallness = 6 * 12 + 6;
		that.hipRating = AppearanceDefs.HIP_RATING_INHUMANLY_WIDE;
		that.buttRating = AppearanceDefs.BUTT_RATING_EXPANSIVE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HARPY;
		that.skinTone = 'pink';
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.skinDesc = 'feathers';
		that.hairColor = 'blue';
		that.hairLength = 16;
		that.initStrTouSpeInte( 60, 40, 90, 40 );
		that.initLibSensCor( 70, 30, 80 );
		that.weaponName = 'talons';
		that.weaponVerb = 'slashing talons';
		that.weaponAttack = 15;
		that.armorName = 'feathers';
		that.armorDef = 5;
		that.bonusHP = 150;
		that.lust = 10;
		that.lustVuln = 0.7;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 10;
		that.gems = 10 + Utils.rand( 4 );
		that.drop = new ChainedDrop().add( ArmorLib.W_ROBES, 1 / 10 )
			.elseDrop( ConsumableLib.GLDSEED );
		that.wingType = AppearanceDefs.WING_TYPE_HARPY;
		that.special1 = that.harpyUberCharge;
		that.special2 = that.harpyTease;
		that.checkMonster();
	};
	return Harpy;
} );