'use strict';

angular.module( 'cocjs' ).factory( 'GoblinAssassin', function( SceneLib, MainView, AppearanceDefs, WeightedDrop, ConsumableLib, Appearance, CoC, EngineCore, Monster, Utils, StatusAffects, Combat ) {
	function GoblinAssassin() {
		this.init(this, arguments);
	}
	angular.extend(GoblinAssassin.prototype, Monster.prototype);
	GoblinAssassin.prototype.goblinDrugAttack = function() {
		var temp2 = Utils.rand( 5 );
		var color = '';
		if( temp2 === 0 ) {
			color = 'red';
		}
		if( temp2 === 1 ) {
			color = 'green';
		}
		if( temp2 === 2 ) {
			color = 'blue';
		}
		if( temp2 === 3 ) {
			color = 'white';
		}
		if( temp2 === 4 ) {
			color = 'black';
		}
		//Throw offensive potions at the player;
		if( color !== 'blue' ) {
			MainView.outputText( this.getCapitalA() + this.short + ' uncorks a glass bottle full of ' + color + ' fluid and swings her arm, flinging a wave of fluid at you.', false );
		}
		//Drink blue pots;
		else {
			MainView.outputText( this.getCapitalA() + this.short + ' pulls out a blue vial and uncaps it, swiftly downing its contents.', false );
			if( this.HPRatio() < 1 ) {
				MainView.outputText( '  She looks to have recovered from some of her wounds!\n', false );
				this.addHP( this.eMaxHP() / 4 );
			} else {
				MainView.outputText( '  There doesn\'t seem to be any effect.\n', false );
			}
		}
		//Dodge chance!;
		if( Combat.combatEvade( 30 ) || (Utils.rand( 100 ) < CoC.player.spe / 5) ) {
			MainView.outputText( '\nYou narrowly avoid the gush of alchemic fluids!\n', false );
		}
		//Get hit!;
		//Temporary heat;
		if( color === 'red' ) {
			MainView.outputText( '\nThe red fluids hit you and instantly soak into your skin, disappearing.  Your skin flushes and you feel warm.  Oh no...\n', false );
			if( !CoC.player.findStatusAffect( StatusAffects.TemporaryHeat ) ) {
				CoC.player.createStatusAffect( StatusAffects.TemporaryHeat, 0, 0, 0, 0 );
			}
		}
		//Green poison;
		if( color === 'green' ) {
			MainView.outputText( '\nThe greenish fluids splash over you, making you feel slimy and gross.  Nausea plagues you immediately - you have been poisoned!\n', false );
			if( !CoC.player.findStatusAffect( StatusAffects.Poison ) ) {
				CoC.player.createStatusAffect( StatusAffects.Poison, 0, 0, 0, 0 );
			}
		}
		//sticky flee prevention;
		if( color === 'white' ) {
			MainView.outputText( '\nYou try to avoid it, but it splatters the ground around you with very sticky white fluid, making it difficult to run.  You\'ll have a hard time escaping now!\n', false );
			if( !CoC.player.findStatusAffect( StatusAffects.NoFlee ) ) {
				CoC.player.createStatusAffect( StatusAffects.NoFlee, 0, 0, 0, 0 );
			}
		}
		//Increase fatigue;
		if( color === 'black' ) {
			MainView.outputText( '\nThe black fluid splashes all over you and wicks into your skin near-instantly.  It makes you feel tired and drowsy.\n', false );
			EngineCore.fatigue( 10 + Utils.rand( 25 ) );
		}
		SceneLib.combatScene.combatRoundOver();
		return;
	};
	//Lust Needle;
	GoblinAssassin.prototype.lustNeedle = function() {
		MainView.outputText( 'With a swift step, the assassin vanishes, her movements too quick for you to follow. You take a sharp breath as you feel her ample thighs clench your head in between them, her slick cunt in full view as you take in her scent.' );
		//Miss;
		if( Combat.combatMiss() || Combat.combatEvade() ) {
			//Miss: ;
			MainView.outputText( '\nYou’ve already prepared, however, as you hold your breath and grab the goblin by her sides. Unhindered by her advance, you take the opportunity to move backwards, throwing the goblin off balance and leaving you only faintly smelling of her pussy.' );
			EngineCore.dynStats( 'lus', Utils.rand( CoC.player.lib / 10 ) + 4 );
		}
		//Hit: ;
		else {
			MainView.outputText( '\nYou’re far too distracted to notice the needle injected into the back of your neck, but by the time she flips back into her original position you already feel the contents of the syringe beginning to take effect.' );
			EngineCore.dynStats( 'lus', Utils.rand( CoC.player.lib / 4 ) + 20 );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	//Dual Shot;
	GoblinAssassin.prototype.dualShot = function() {
		MainView.outputText( 'The assassin throws a syringe onto the ground, shattering it and allowing the dissipating smoke from its contents to distract you long enough for her to slip underneath you. With a quick flick of her wrists two needles are placed into her hands, though you’ve already caught wind of her movements.' );
		//Miss: ;
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatMisdirect() || Combat.combatFlexibility() ) {
			MainView.outputText( '\nYou jump backwards, far enough to avoid her quick thrust upwards as she attempts to lick the area in which your crotch once stood. Realising her situation, she quickly removes herself from the ground and faces you, more determined than before.' );
		}
		//Hit: ;
		else {
			MainView.outputText( '\nBefore you can do anything to stop her, she lifts her head and takes a swift lick of your crotch, taking a small moan from you and giving her enough time to stab into the back of your knees. She rolls out of the way just as you pluck the two needles out and throw them back to the ground. They didn’t seem to have anything in them, but the pain is enough to make you stagger.' );
			//(Medium HP loss, small lust gain);
			var damage = Math.ceil( (this.str + this.weaponAttack + 40) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
			damage = CoC.player.takeDamage( damage );
			MainView.outputText( ' (' + damage + ')' );
		}
		SceneLib.combatScene.combatRoundOver();
	};
	//Explosion;
	GoblinAssassin.prototype.goblinExplosion = function() {
		MainView.outputText( 'Without a second thought, the assassin pulls a thin needle from the belt wrapped around her chest and strikes it against the ground, causing a flame to erupt on the tip. She twirls forward, launching the needle in your direction which subsequently bursts apart and showers you with heat.' );
		MainView.outputText( '\nYou shield yourself from the explosion, though the goblin has already lit a second needle which she throws behind you, launching your body forwards as it explodes behind your back. ' );
		//(High HP loss, no lust gain);
		var damage = 25 + Utils.rand( 75 );
		damage = CoC.player.takeDamage( damage );
		MainView.outputText( ' (' + damage + ')' );
		SceneLib.combatScene.combatRoundOver();
	};
	GoblinAssassin.prototype.defeated = function() {
		SceneLib.goblinAssassinScene.gobboAssassinRapeIntro();
	};
	GoblinAssassin.prototype.won = function() {
		if( CoC.player.gender === 0 ) {
			MainView.outputText( 'You collapse in front of the goblin, too wounded to fight.  She growls and kicks you in the head, making your vision swim. As your sight fades, you hear her murmur, "<i>Fucking dicks can\'t even bother to grow a dick or cunt.</i>"', false );
			SceneLib.combatScene.cleanupAfterCombat();
		} else {
			SceneLib.goblinAssassinScene.gobboAssassinBeatYaUp();
		}
	};
	GoblinAssassin.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('GoblinAssassin');
		if( args[ 0 ] ) {
			return;
		}
		that.a = 'the ';
		that.short = 'goblin assassin';
		that.imageName = 'goblinassassin';
		that.long = 'Her appearance is that of a regular goblin, curvy and pale green, perhaps slightly taller than the norm. Her wavy, untamed hair is a deep shade of blue, covering her pierced ears and reaching just above her shoulders. Her soft curves are accentuated by her choice of wear, a single belt lined with assorted needles strapped across her full chest and a pair of fishnet stockings reaching up to her thick thighs. She bounces on the spot, preparing to dodge anything you might have in store, though your eyes seem to wander towards her bare slit and jiggling ass. Despite her obvious knowledge in combat, she’s a goblin all the same – a hard cock can go a long way.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_DROOLING, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 90, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 50, 0, 0, 0 );
		that.tallness = 35 + Utils.rand( 4 );
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE + 2;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'dark green';
		that.hairColor = 'blue';
		that.hairLength = 7;
		that.initStrTouSpeInte( 45, 55, 110, 95 );
		that.initLibSensCor( 65, 35, 60 );
		that.weaponName = 'needles';
		that.weaponVerb = 'stabbing needles';
		that.armorName = 'leather straps';
		that.bonusHP = 70;
		that.lust = 50;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 10;
		that.gems = Utils.rand( 50 ) + 25;
		that.drop = new WeightedDrop().add( ConsumableLib.GOB_ALE, 5 ).addMany( 1, ConsumableLib.L_DRAFT,
			ConsumableLib.PINKDYE,
			ConsumableLib.BLUEDYE,
			ConsumableLib.ORANGDY,
			ConsumableLib.PURPDYE );// TODO this is a copy of goblin drop. consider replacement with higher-lever stuff
		that.checkMonster();
	};
	GoblinAssassin.prototype.performCombatAction = function() {
		var actions = [ this.eAttack, this.goblinDrugAttack, this.lustNeedle, this.dualShot, this.goblinExplosion ];
		actions[ Utils.rand( actions.length ) ]();
	};
	return GoblinAssassin;
} );