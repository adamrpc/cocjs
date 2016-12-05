'use strict';

angular.module( 'cocjs' ).factory( 'Kitsune', function( SceneLib, CoC, PerkLib, Monster, Utils, StatusAffects, Appearance, AppearanceDefs, WeightedDrop, Combat, EngineCore, ConsumableLib, SandWitch, kFLAGS, CockTypesEnum ) {
	function Kitsune() {
		this.init(this, arguments);
	}
	angular.extend(Kitsune.prototype, Monster.prototype);

	// Combat Abilities:
	// the kitsune are an almost purely magical mob, relying mainly on tease attacks and spells that raise lust.
	//Entwine:
	Kitsune.prototype.kitsuneEntwine = function() {
		EngineCore.outputText( 'The kitsune closes in on you with a mischievous glint in her eyes.  You raise your guard, keeping your eyes trained on her to ensure that she doesn\'t try to pull anything.  Suddenly, you feel something coiling around your ' + CoC.player.leg() + ', and let out a yelp as you are suddenly lifted into the air, entangled in the kitsune\'s tails!' );
		EngineCore.outputText( '\n\nYour limbs are bound tightly while coils of delightfully soft fur caress you on all sides.  You can do little besides struggle against your furry bonds as the constant writhing of her tails sends shudders flying up and down your spine.' );
		this.createStatusAffect( StatusAffects.PCTailTangle, 0, 0, 0, 0 );
		EngineCore.dynStats( 'lus', 10 + CoC.player.sens / 8 );
		Combat.combatRoundOver();
	};
	//Struggle - event 5077 in combat.as
	Kitsune.prototype.kitsuneStruggle = function() {
		EngineCore.clearOutput();
		//Struggle:
		EngineCore.outputText( 'You struggle against the kitsune\'s tails with all your might, desperately trying to free yourself before she has her way with you.' );
		//Success
		if( Utils.rand( 20 ) + CoC.player.str / 20 + this.statusAffectv1( StatusAffects.PCTailTangle ) >= 12 ) {
			EngineCore.outputText( '  Summoning up reserves of strength you didn\'t know you had, you wrench yourself free of her tails, pushing her away.\n\n' );
			this.removeStatusAffect( StatusAffects.PCTailTangle );
			this.doAI();
		}
		//Failure - +5-10 LUST
		else {
			EngineCore.outputText( '  Despite your valiant efforts, your wriggling only serves to get you deeper entangled in the fluffy tails, eliciting an amused giggle from the kitsune.' );
			EngineCore.outputText( '\n\nShe licks her lips, running her hands along you wherever she can find exposed flesh.  Her fingertips leave small trails of dazzling blue that make you flush with lust - you must escape her grasp soon or else you will be like putty in her hands!' );
			EngineCore.dynStats( 'lus', 5 + CoC.player.sens / 10 );
			this.addStatusValue( StatusAffects.PCTailTangle, 1, 3 );
			Combat.combatRoundOver();
		}
	};
	Kitsune.prototype.kitsuneWait = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'Happily, you slump deeper into the fluffy tails, eliciting an amused giggle from the kitsune.' );
		if( EngineCore.silly() ) {
			EngineCore.outputText( '  You\'re so glad you got to touch fluffy tail.' );
		}
		EngineCore.outputText( '\n\nShe licks her lips, running her hands along you wherever she can find exposed flesh.  Her fingertips leave small trails of dazzling blue that make you flush with lust - you must escape her grasp soon or else you will be like putty in her hands!' );
		EngineCore.dynStats( 'lus', 5 + CoC.player.sens / 10 );
		Combat.combatRoundOver();
	};
	//Fox Fire: - Low piercing damage, +10-15 LUST
	Kitsune.prototype.foxFireAttack = function() {
		EngineCore.outputText( 'The kitsune makes a small circle in the air with her fingers, conjuring up a pale blue flame into her palm with the sound of flint striking against steel.  Pursing her lips, she blows it toward you with a kiss.' );
		EngineCore.outputText( '\n\nThe flames burn furiously, but leave you with an incredibly pleasant tingling sensation all over your body.  Your skin flushes with excitement, and you can feel blood rushing to your extremities, making you shudder with pleasure.' );
		var damage = 5 + Utils.rand( 20 );
		damage = CoC.player.takeDamage( damage );
		EngineCore.outputText( ' (' + damage + ')' );
		EngineCore.dynStats( 'lus', 15 + CoC.player.sens / 10 );
		Combat.combatRoundOver();
	};
	//Illusion: - Raises enemy evasion, but can be resisted.
	//Factors affecting resist: INT (1% per point, max 70%), 'Whispered' perk (20% flat bonus), 'Religious' background and < 20 corruption (20% bonus at 0, losing 1% per point of corruption.)
	//Success:
	Kitsune.prototype.illusionKitsuneAttack = function() {
		EngineCore.outputText( 'You struggle to keep your eyes on the kitsune, ghostly laughter echoing all around you as you turn to and fro, trying to track her movements.  It almost seems like the edges of reality are blurring around her, severely distorting your perceptions and making it hard to follow her.  It\'s going to be much harder to hit her if she keeps this up!' );
		//Resist: - successfully resisting deals small health & lust damage to kitsune
		var resist = 0;
		if( CoC.player.inte < 30 ) {
			resist = Math.round( CoC.player.inte );
		} else {
			resist = 30;
		}
		if( CoC.player.findPerk( PerkLib.Whispered ) >= 0 ) {
			resist += 20;
		}
		if( CoC.player.findPerk( PerkLib.HistoryReligious ) >= 0 && CoC.player.cor < 20 ) {
			resist += 20 - CoC.player.cor;
		}
		if( Utils.rand( 100 ) < resist ) {
			EngineCore.outputText( '\n\nThe kitsune seems to melt away before your eyes for a moment, as though the edges of reality are blurring around her.  You tighten your focus, keeping your eyes trained on her, and she suddenly reels in pain, clutching her forehead as she is thrust back into view.  She lets out a frustrated huff of disappointment, realizing that you have resisted her illusions.' );
		} else {
			this.createStatusAffect( StatusAffects.Illusion, 0, 0, 0, 0 );
			this.spe += 20;
		}
		Combat.combatRoundOver();
	};
	//Seal: - cancels and disables whatever command the player uses this round. Lasts 3 rounds, cannot seal more than one command at a time.
	//PCs with 'Religious' background and < 20 corruption have up to 20% resistance to sealing at 0 corruption, losing 1% per corruption.
	Kitsune.prototype.kitsuneSealAttack = function() {
		var resist = 0;
		if( CoC.player.inte < 30 ) {
			resist = Math.round( CoC.player.inte );
		} else {
			resist = 30;
		}
		if( CoC.player.findPerk( PerkLib.Whispered ) >= 0 ) {
			resist += 20;
		}
		if( CoC.player.findPerk( PerkLib.HistoryReligious ) >= 0 && CoC.player.cor < 20 ) {
			resist += 20 - CoC.player.cor;
		}
		var select = Utils.rand( 7 );
		//Attack:
		if( select === 0 ) {
			EngineCore.outputText( 'The kitsune playfully darts around you, grinning coyly.  She somehow slips in under your reach, and before you can react, draws a small circle on your chest with her fingertip.  As you move to strike again, the flaming runic symbol she left on you glows brightly, and your movements are halted mid-swing.' );
			EngineCore.outputText( '\n\n"<i>Naughty naughty, you should be careful with that.</i>"' );
			EngineCore.outputText( '\n\nDespite your best efforts, every time you attempt to attack her, your muscles recoil involuntarily and prevent you from going through with it.  <b>The kitsune\'s spell has sealed your attack!</b>  You\'ll have to wait for it to wear off before you can use your basic attacks.' );
			CoC.player.createStatusAffect( StatusAffects.Sealed, 4, 0, 0, 0 );
		} else if( select === 1 ) {
			//Tease:
			EngineCore.outputText( 'You are taken by surprise when the kitsune appears in front of you out of nowhere, trailing a fingertip down your chest.  She draws a small circle, leaving behind a glowing, sparking rune made of flames.  You suddenly find that all your knowledge of seduction and titillation escapes you.  <b>The kitsune\'s spell has sealed your ability to tease!</b>  Seems you won\'t be getting anyone hot and bothered until it wears off.' );
			CoC.player.createStatusAffect( StatusAffects.Sealed, 4, 1, 0, 0 );
		}
		//Spells:
		else if( select === 2 ) {
			EngineCore.outputText( '"<i>Oh silly, trying to beat me at my own game are you?</i>"  the kitsune says with a smirk, surprising you as she appears right in front of you.  She traces a small circle around your mouth, and you find yourself stricken mute!  You try to remember the arcane gestures to cast your spell and find that you\'ve forgotten them too.  <b>The kitsune\'s spell has sealed your magic!</b>  You won\'t be able to cast any spells until it wears off.' );
			CoC.player.createStatusAffect( StatusAffects.Sealed, 4, 2, 0, 0 );
		}
		//Items:
		else if( select === 3 ) {
			EngineCore.outputText( '"<i>Tsk tsk, using items?  That\'s cheating!</i>"  the kitsune says as she appears right in front of you, taking you off guard.  Her finger traces a small circle on your pouch, leaving behind a glowing rune made of crackling flames.  No matter how hard you try, you can\'t seem to pry it open.  <b>The kitsune\'s spell has sealed your item pouch!</b>  Looks like you won\'t be using any items until the spell wears off.' );
			CoC.player.createStatusAffect( StatusAffects.Sealed, 4, 3, 0, 0 );
		}
		//Run:
		else if( select === 4 ) {
			EngineCore.outputText( '"<i>Tsk tsk, leaving so soon?</i>"  the kitsune says, popping up in front of you suddenly as you attempt to make your escape.  Before you can react, she draws a small circle on your chest with her fingertip, leaving behind a glowing rune made of crackling blue flames.  You try to run the other way, but your ' + CoC.player.legs() + ' won\'t budge!\n\n"<i>Sorry baby, you\'ll just have to stay and play~.</i>" she says in a singsong tone, appearing in front of you again.  <b>The kitsune\'s spell prevents your escape!</b>  You\'ll have to tough it out until the spell wears off.' );
			CoC.player.createStatusAffect( StatusAffects.Sealed, 4, 4, 0, 0 );
		}
		//P.Special:
		else if( select === 5 ) {
			EngineCore.outputText( 'You jump with surprise as the kitsune appears in front of you, grinning coyly.  As she draws a small circle on your forehead with her fingertip, you find that you suddenly can\'t remember how to use any of your physical skills!' );
			EngineCore.outputText( '\n\n"<i>Oh no darling, </i>I\'m<i> the one with all the tricks here.</i>"' );
			EngineCore.outputText( '\n\n<b>The kitsune\'s spell has sealed your physical skills!</b>  You won\'t be able to use any of them until the spell wears off.' );
			CoC.player.createStatusAffect( StatusAffects.Sealed, 4, 5, 0, 0 );
		}
		//M.Special:
		else {
			EngineCore.outputText( 'You jump with surprise as the kitsune appears in front of you, grinning coyly.  As she draws a small circle on your forehead with her fingertip, you find that you suddenly can\'t remember how to use any of your magical skills!' );
			EngineCore.outputText( '\n\n"<i>Oh no darling, </i>I\'m<i> the one with all the tricks here.</i>"' );
			EngineCore.outputText( '\n\n<b>The kitsune\'s spell has sealed your magical skills!</b>  You won\'t be able to use any of them until the spell wears off.' );
			CoC.player.createStatusAffect( StatusAffects.Sealed, 4, 6, 0, 0 );
		}
		if( resist >= Utils.rand( 100 ) ) {
			EngineCore.outputText( '\n\nUpon your touch, the seal dissipates, and you are free of the kitsune\'s magic!  She pouts in disappointment, looking thoroughly irritated, but quickly resumes her coy trickster facade.' );
			CoC.player.removeStatusAffect( StatusAffects.Sealed );
		}
		Combat.combatRoundOver();
	};
	//Tease Texts:
	Kitsune.prototype.kitSuneTeases = function() {
		var select = Utils.rand( 3 );
		if( this.hairColor === 'red' && Utils.rand( 2 ) === 0 ) {
			select = 3;
		}
		if( select === 0 ) {
			EngineCore.outputText( 'You rub your eyes, suddenly seeing triple as you find yourself in the midst of a crowd of kitsune doppelgangers.  They run their hands all over you, teasing and doting on you as their tails caress every inch of your body.  Taken by surprise, you forget to fight back until they have already dispersed, blending back into a single fox-woman.' );
		} else if( select === 1 ) {
			EngineCore.outputText( 'Bending forward, the kitsune runs her hands down over her breasts, jiggling them enticingly and squeezing them together.  Hooking a finger in her robes, she slides it down, tugging them aside until her nipples are just barely covered, and with a teasing smirk, pulls them back up, leaving you wanting.' );
		} else if( select === 2 ) {
			EngineCore.outputText( 'Turning her back to you, the kitsune fans out her tails, peering back as she lifts the hem of her robe to expose her plump hindquarters.  Her tails continually shift and twist, blocking your view, but it only serves to make you want it even <i>more</i>, licking your lips in anticipation.' );
		}//Redhead only:
		else {
			EngineCore.outputText( 'The kitsune sways her hips enticingly as she appears in front of you abruptly, rubbing up against your side.  Her teasing caresses make you shiver with arousal, and you can feel something thick and warm pressing against your [hips].  She gives you a wry grin as she breaks away from you, sporting an obvious tent in her robes.  "<i>Just you wait...</i>"' );
		}
		EngineCore.dynStats( 'lus', 5 + CoC.player.sens / 7 );
		Combat.combatRoundOver();
	};
	Kitsune.prototype.performCombatAction = function() {
		var moves = [ this.foxFireAttack, this.foxFireAttack, this.kitSuneTeases, this.kitSuneTeases ];
		if( CoC.player.findStatusAffect( StatusAffects.Sealed ) < 0 ) {
			moves.push( this.kitsuneSealAttack );
		}
		if( CoC.player.findStatusAffect( StatusAffects.Sealed ) < 0 ) {
			moves.push( this.kitsuneSealAttack );
		}
		if( this.findStatusAffect( StatusAffects.PCTailTangle ) < 0 ) {
			moves.push( this.kitsuneEntwine );
		}
		if( this.findStatusAffect( StatusAffects.Illusion ) < 0 ) {
			moves.push( this.illusionKitsuneAttack );
		}
		moves[ Utils.rand( moves.length ) ]();
	};

	Kitsune.prototype.defeated = function() {
		SceneLib.kitsuneScene.defeatTheKitsunes();
	};
	Kitsune.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe kitsune recoils before running off, no longer interested in you...' );
			Combat.cleanupAfterCombat();
		} else {
			SceneLib.kitsuneScene.loseToKitsunes();
		}
	};
	SandWitch.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('SandWitch');
		if( Utils.rand( 3 ) !== 2 ) {
			CoC.flags[ kFLAGS.redheadIsFuta ] = 1;
		}
		that.a = 'a ';
		that.short = 'kitsune';
		that.imageName = 'kitsune';
		that.long = 'A kitsune stands in front of you, about five and a half feet tall.  She has a head of ' + ({
				'blonde': 'long flaxen',
				'black': 'lustrous, ass-length black',
				'red': 'unkempt, shoulder-length reddish'
			}[ args[ 0 ] ]) +
			' hair.  She appears mostly human, except for a pair of large, furry ears poking through her hair and six luxurious silky tails swaying in the air behind her.  Her robes are revealing but comfortable-looking, hugging her voluptuous curves and exposing large swaths of tattooed skin.  A layer of ornate tattoos covers patches of her exposed flesh, accentuating her feminine curves nicely, and each movement brings a pleasant jiggle from her plump backside and large breasts.';
		// this.plural = false;
		if( args[ 0 ] === 'red' && CoC.flags[ kFLAGS.redheadIsFuta ] === 1 ) {
			that.createCock( Utils.rand( 13 ) + 14, 1.5 + Utils.rand( 20 ) / 2, CockTypesEnum.HUMAN );
			that.balls = 2;
			that.ballSize = 2 + Utils.rand( 13 );
			that.cumMultiplier = 1.5;
			that.hoursSinceCum = that.ballSize * 10;
		}
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 20, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'D' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.createStatusAffect( StatusAffects.BonusACapacity, 20, 0, 0, 0 );
		that.tallness = Utils.rand( 24 ) + 60;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.skinTone = 'pale';
		that.hairColor = args[ 0 ];
		that.hairLength = 13 + Utils.rand( 20 );
		that.initStrTouSpeInte( 35, 45, 90, 95 );
		that.initLibSensCor( 60, 65, 45 );
		that.weaponName = 'claws';
		that.weaponVerb = 'punch';
		that.armorName = 'skin';
		that.bonusHP = 120;
		that.lust = 20;
		that.lustVuln = 0.9;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 6;
		that.gems = Utils.rand( 10 ) + 10;
		that.drop = new WeightedDrop( ConsumableLib.FOXJEWL, 1 );
		that.tailType = AppearanceDefs.TAIL_TYPE_FOX;
		that.checkMonster();
	};
	return Kitsune;
} );