'use strict';

angular.module( 'cocjs' ).factory( 'FetishZealot', function( $log, SceneLib, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Combat, WeightedDrop, ConsumableLib, WeaponLib, ArmorLib ) {
	function FetishZealot() {
		this.init(this, arguments);
	}
	angular.extend(FetishZealot.prototype, Monster.prototype);
	var RELIGIOUS_CLOTHES = 'religious clothes';
	var PIRATE_CLOTHES = 'pirate clothes';
	var MILITARY_CLOTHES = 'military clothes';
	var LEATHER_CLOTHES = 'leather clothes';
	var STUDENTS_CLOTHES = 'student\'s clothes';
	FetishZealot.prototype._superCombatRoundUpdate = FetishZealot.prototype.combatRoundUpdate;
	FetishZealot.prototype.combatRoundUpdate = function() {
		this._superCombatRoundUpdate();
		var changed = false;
		//Fetish Zealot Update!
		switch( Utils.rand( 5 ) ) {
			case 0:
				//Religious outfit!
				if( this.armorName !== RELIGIOUS_CLOTHES ) {
					this.long = 'The zealot is clad in a bizarre set of religious robes.  They are similar to what you\'ve seen on other religious leaders from home, but none of them included the large slit at the front that lets his above average sized human dick stick out of the front.';
					this.armorName = RELIGIOUS_CLOTHES;
					changed = true;
				}
				break;
			case 1:
				//Pirate Outfit
				if( this.armorName !== PIRATE_CLOTHES ) {
					this.armorName = PIRATE_CLOTHES;
					this.long = 'You are faced with one of the strangest things you have ever seen in your life.  A stereotypical pirate, who has not replaced his hand with a hook, but rather a collection of sex toys.  You can see at least two dildos, a fleshlight, and numerous other toys that you\'re incapable of recognizing.';
					changed = true;
				}
				break;
			case 2:
				//Military Uniform
				if( this.armorName !== MILITARY_CLOTHES ) {
					this.long = 'In front of you is someone wearing a green military uniform.  They obviously aren\'t in any military you\'ve ever heard of, as on his shoulder he has emblazoned <i>FF Army Sex Instructor</i>.  It seems you are his latest recruit...';
					this.armorName = MILITARY_CLOTHES;
					changed = true;
				}
				break;
			case 3:
				//Leather fetish shiiiiite
				if( this.armorName !== LEATHER_CLOTHES ) {
					this.long = 'The Zealot has taken on an appearance that seems more suitable for the level of perversion he exudes.  He is wearing a full-body suit of leather, with a cock case over his crotch; you can clearly see a large zipper on it.  The zipper handle is far bigger than you think is absolutely necessary.';
					this.armorName = LEATHER_CLOTHES;
					changed = true;
				}
				break;
			case 4:
				//Student
				if( this.armorName !== STUDENTS_CLOTHES ) {
					this.long = 'The Zealot seems to have taken on the appearance of a young adult wearing a student uniform of sorts; of course, this isn\'t any less perverted than any of the other costumes this man wears.  This one includes a number of loose straps that you\'re certain would cause large sections of his clothes to fall off if somebody pulled on them.';
					this.armorName = STUDENTS_CLOTHES;
					changed = true;
				}
				break;
		}
		//Talk abouts it mang!
		if( changed ) {
			EngineCore.outputText( 'The fetish zealot\'s clothing shifts and twists, until he is wearing ' + this.armorName + '.\n\n', false );
		}
		this.lust += this.lustVuln * 5;
	};
	//Special1: Tease
	//See Costumes section for text
	FetishZealot.prototype.zealotSpecial1 = function() {
		//Costumes
		//This foe periodically switches between outfits; this determines what text is displayed when they use tease.
		//Perverted religious costume;
		if( this.armorName === RELIGIOUS_CLOTHES ) {
			//The zealot is clad in a bizarre set of religious robes.  They are similar to what you've seen on other religious leaders from home, but none that included the large slit at the front that lets his above average sized human dick stick out the front.
			EngineCore.outputText( 'The zealot cries out "<i>Child, are you ready to present your offering to the holy rod?</i>" while indicating his cock sliding between his robes.  The whole scene leaves you distracted for a few moments and significantly aroused.', false );
		}
		//A pirate costume; 
		if( this.armorName === PIRATE_CLOTHES ) {
			//You are faced with one of the strangest things you have ever seen in your life.  A stereotypical pirate, who has not replaced his hand with a hook, but rather a collection of sex toys.  You can see at least two dildos, a fleshlight, and numerous other toys that you're incapable of recognizing.
			EngineCore.outputText( 'The zealot turns to the side holding his prosthetic towards you and doing something that sends the devices spinning and clicking.  <i>So that\'s how that would work...<i> you find yourself thinking for a few moments before realizing that he had both distracted and aroused you.', false );
		}
		//Military attire;
		if( this.armorName === MILITARY_CLOTHES ) {
			//In front of you is someone wearing a green military uniform.  They obviously aren't in any military you've ever heard of, as on his shoulder he has emblazoned <i>FF Army Sex Instructor</i>.  It seems you are his latest Recruit...
			EngineCore.outputText( 'He suddenly barks, "<i>Let\'s see those genitals, soldier!</i>" ', false );
			//[CoC.player is corrupt] 
			if( CoC.player.cor > 50 ) {
				EngineCore.outputText( 'You eagerly cry out "<i>Yes, sir!</i>" and show yourself off to the best of your ability.  The whole act is extremely arousing.', false );
			}//[CoC.player is not corrupt]
			else {
				EngineCore.outputText( 'You have no idea why, but you promptly display yourself in the most provocative way possible.  After a moment you realize what you\'re doing and quickly stop, flushed with embarrassment and arousal.', false );
			}
		}
		//Gimp gear;
		if( this.armorName === LEATHER_CLOTHES ) {
			//The Zealot has taken on an appearance that seems more suitable for the level of perversion he exudes.  He is wearing a full-body suit of leather, with a cock case over his crotch; you can clearly see a large zipper on it.  The zipper handle is far bigger than you think is absolutely necessary.
			EngineCore.outputText( 'The Zealot turns around and gives you a full view of his tight leather clad body.  He smacks his ass and says "<i>You like what you see, don\'t you ' + CoC.player.mf( 'stud', 'slut' ) + '?</i>"  You can\'t help but be incredibly aroused by the scene.', false );
		}
		//Well dressed and well groomed student in uniform;
		if( this.armorName === STUDENTS_CLOTHES ) {
			//The Zealot seems to have taken on the appearance of a young adult wearing a student uniform of sorts; of course, this isn't any less perverted than any of the other costumes this man wears.  This one includes a number of loose straps that you're certain would cause large sections of his clothes to fall off if somebody pulled on them.
			EngineCore.outputText( 'The Zealot student looks at you a little shyly and sticks a pencil in his mouth while pushing a hand in front of his groin, trying to hide a rather obvious bulge.  The whole scene is rather cute, and you feel incredibly aroused afterwards.', false );
		}
		EngineCore.dynStats( 'lus', (7 + Utils.rand( CoC.player.lib / 20 + CoC.player.cor / 20 )) );
		Combat.combatRoundOver();
	};
	//Special2: Lust transfer spell, it becomes more and 
	//more likely that he will use this power as his lust gets 
	//higher, but he can use it at any time (like the cultist).
	FetishZealot.prototype.zealotSpecial2 = function() {
		EngineCore.outputText( 'The zealot suddenly cries out and extends his arms towards you; your mind is suddenly overwhelmed with a massive wave of arousal as images of every kind of fetish you can imagine wash over you, all blended together.  After a moment you are able to recover, but you notice that the Zealot doesn\'t seem to be as aroused as before.', false );
		EngineCore.dynStats( 'lus', this.lust / 2 );
		this.lust /= 2;
		Combat.combatRoundOver();
	};
	FetishZealot.prototype._superPostAttack = FetishZealot.prototype.postAttack;
	FetishZealot.prototype.postAttack = function( damage ) {
		if( damage > 0 ) {
			EngineCore.outputText( '\nYou notice that some kind of unnatural heat is flowing into your body from the wound', false );
			if( CoC.player.inte > 50 ) {
				EngineCore.outputText( ', was there some kind of aphrodisiac on the knife?', false );
			} else {
				EngineCore.outputText( '.', false );
			}
			EngineCore.dynStats( 'lus', (CoC.player.lib / 20 + 5) );
		}
		this._superPostAttack( damage );
	};
	FetishZealot.prototype.defeated = function() {
		SceneLib.fetishZealotScene.zealotDefeated();
	};
	FetishZealot.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nThe fetish cultist ignores the perverse display and continues on as if nothing had happened...', false );
			CoC.player.orgasm();
			EngineCore.doNext( SceneLib.fetishZealotScene, SceneLib.fetishZealotScene.zealotLossRape );
		} else {
			SceneLib.fetishZealotScene.zealotLossRape();
		}
	};
	FetishZealot.prototype.init = function(that, args) {
		Monster.prototype.init(that, args);
		that.classNames.push('FetishZealot');
		$log.debug( 'FetishZealot Constructor!' );
		that.a = 'the ';
		that.short = 'fetish zealot';
		that.imageName = 'fetishzealot';
		that.long = 'The zealot is clad in a bizarre set of religious robes.  They are similar to what you\'ve seen on other religious leaders from home, but none that included the large slit at the front that lets his above average sized human dick stick out the front.';
		that.createCock( 7, 1.5 );
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_LOOSE;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 40, 0, 0, 0 );
		that.tallness = 6 * 12;
		that.hipRating = AppearanceDefs.HIP_RATING_BOYISH + 1;
		that.buttRating = AppearanceDefs.BUTT_RATING_TIGHT;
		that.skinTone = 'tan';
		that.hairColor = 'black';
		that.hairLength = 4;
		that.initStrTouSpeInte( 35, 35, 30, 1 );
		that.initLibSensCor( 75, 80, 90 );
		that.weaponName = 'wavy dagger';
		that.weaponVerb = 'stab';
		that.weaponAttack = 3;
		that.armorName = RELIGIOUS_CLOTHES;
		that.armorDef = 5;
		that.lust = 25;
		that.lustVuln = 0.75;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 5;
		that.gems = 5 + Utils.rand( 10 );
		that.drop = new WeightedDrop().add( ArmorLib.C_CLOTH, 1 )
			.add( ConsumableLib.L_DRAFT, 4 )
			.add( WeaponLib.L_DAGGR, 1 )
			.add( null, 4 );
		that.special1 = that.zealotSpecial1;
		that.special2 = that.zealotSpecial2;
		that.checkMonster();
	};
	return FetishZealot;
} );