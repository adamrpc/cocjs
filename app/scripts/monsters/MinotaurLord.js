'use strict';

angular.module( 'cocjs' ).factory( 'MinotaurLord', function( SceneLib, MainView, CoC, WeaponLib, Combat, EngineCore, CockTypesEnum, Utils, AppearanceDefs, Monster, StatusAffects ) {
	function MinotaurLord() {
		this.init(this, arguments);
	}
	angular.extend(MinotaurLord.prototype, Monster.prototype);
	MinotaurLord.prototype.performCombatAction = function() {
		if( this.HP < 300 && this.statusAffectv1( StatusAffects.MinoMilk ) < 4 ) {
			this.minotaurDrankMalk();
		} else if( Utils.rand( 4 ) === 0 && CoC.player.weaponName !== 'fists' ) {
			this.minotaurDisarm();
		} else if( this.findStatusAffect( StatusAffects.Timer ) < 0 ) {
			this.minotaurLordEntangle();
		} else if( this.findStatusAffect( StatusAffects.MinotaurEntangled ) >= 0 ) {
			this.minotaurCumPress();
		} else {
			if( Utils.rand( 2 ) === 0 ) {
				this.minotaurPrecumTease();
			} else {
				this.eAttack();
			}
		}
	};
	MinotaurLord.prototype.minotaurDrankMalk = function() {
		EngineCore.outputText( 'The minotaur lord snorts audibly and turns to look at his mistress.  "<i>What is it, Fido, boy?  You thirsty?</i>"  The hulking minotaur nods.' );
		//Success:*;
		if( this.statusAffectv1( StatusAffects.MinoMilk ) < 3 ) {
			EngineCore.outputText( '"<i>Catch!</i>"  The succubus throws a bottle containing a milky-white substance to the minotaur.  He grabs it and uncorks the bottle, quickly chugging its contents with obvious enjoyment.  After he is done he looks even more energetic and ready to fight, and his cock looks even harder!' );
			this.addHP( 300 );
			this.lust += 10;
			if( this.findStatusAffect( StatusAffects.MinoMilk ) < 0 ) {
				this.createStatusAffect( StatusAffects.MinoMilk, 1, 0, 0, 0 );
			} else {
				this.addStatusValue( StatusAffects.MinoMilk, 1, 1 );
			}
		}
		//Failure:*;
		else {
			EngineCore.outputText( '"<i>Well too bad!  We\'re all out of milk... but don\'t worry, my dear pet, I\'ll let you drink as much as you want after you\'re done with this bitch.</i>"  The succubus replies, idly checking her elongated nails.' );
			EngineCore.outputText( '\n\nThe minotaur glares at you and snorts, obviously pissed at not getting his serving...' );
			this.addStatusValue( StatusAffects.MinoMilk, 1, 1 );
		}
		Combat.combatRoundOver();
	};
	MinotaurLord.prototype.minotaurDisarm = function() {
		EngineCore.outputText( 'The giant of a minotaur raises his chain threateningly into the air, clearly intent on striking you down.  With your trained reflexes, you quickly move to block his blow with your halberd.  You recoil as the chain impacts your halberd with a loud clang, wrapping around it.  You smile triumphantly at the minotaur, only to glance at his smirk.  With a strong pull, he rips the halberd off your hands and into a corner of the room. Shit!' );
		EngineCore.outputText( '\n\nThe succubus laughs maniacally.  "<i>Good boy, Fido!  Take that fox slut\'s toys away so she\'ll be easier to play with!</i>"  The minotaur puffs his chest, proud of himself for pleasing his mistress.' );
		CoC.player.setWeapon( WeaponLib.FISTS );
		Combat.combatRoundOver();
	};
	MinotaurLord.prototype.minotaurLordEntangle = function() {
		EngineCore.outputText( 'The minotaur lord lashes out with his chain, swinging in a wide arc!\n' );
		this.createStatusAffect( StatusAffects.Timer, 2 + Utils.rand( 4 ), 0, 0, 0 );
		//{dodge/whatever};
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( 'You leap over the clumsy swing, allowing the chain to fly harmlessly underneath you!' );
		} else {
			EngineCore.outputText( 'You try to avoid it, but you\'re too slow, and the chain slaps into your hip, painfully bruising you with the strength of the blow, even through your armor.  The inertia carries the back half of the whip around you, and in a second, the chain has you all wrapped up with your arms pinned to your sides and your movement restricted.' );
			EngineCore.outputText( '\n\n"<i>Hahaha!  Good boy, Fido!  Leash that bitch up!</i>"  The succubus laughs with glee.' );
			EngineCore.outputText( '\n\n<b>You\'re tangled up in the minotaur lord\'s chain, and at his mercy, unless you can break free!</b>' );
			this.createStatusAffect( StatusAffects.MinotaurEntangled, 0, 0, 0, 0 );
		}
		Combat.combatRoundOver();
	};
	MinotaurLord.prototype.minotaurCumPress = function() {
		EngineCore.outputText( 'The minotaur lord tugs on the end of the chain, pulling you toward him, making you spin round and round so many times that you\'re dazed and dizzy.  You can feel the links coming free of your fur, and the closer you get, the more freedom of movement you have.  Yet, the dizziness makes it hard to do anything other than stumble.  You splat into something wet, sticky, and spongy.  You gasp, breathing a heavy gasp of minotaur musk that makes your head spin in a whole different way.  You pry yourself away from the sweaty, sperm-soaked nuts you landed on and look up, admiring the towering horse-cock with its three-rings of pre-puce along its length.  A droplet of pre-cum as fat as your head smacks into your face, staggering you back and dulling your senses with narcotic lust.' );
		EngineCore.dynStats( 'lus', 22 + CoC.player.lib / 8 + CoC.player.sens / 8 );
		EngineCore.outputText( 'You tumble to your knees a few feet away, compulsively licking it up.  Once it\'s gone, ' );
		if( CoC.player.lust > 99 ) {
			EngineCore.outputText( 'you rise up, horny and hungry for more.' );
		} else {
			EngineCore.outputText( 'you realize what you\'ve been doing.  Your embarrassment gives you the strength to re-adopt your fighting pose, but it\'s hard with how rigid' );
			if( CoC.player.lust >= 80 ) {
				EngineCore.outputText( ' and drippy' );
			}
			EngineCore.outputText( ' your cock has become.  You want another taste...' );
		}
		this.removeStatusAffect( StatusAffects.MinotaurEntangled );
		Combat.combatRoundOver();
	};
	MinotaurLord.prototype.minotaurPrecumTease = function() {
		EngineCore.outputText( 'The minotaur smiles at you and lifts his loincloth, flicking it at you.  Thick ropes of pre-cum fly through the air in a swarm,' );
		if( Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( ' slapping into your face before you can react!  You wipe the slick snot-like stuff out of your eyes and nose, ' );
			if( CoC.player.lust >= 70 ) {
				EngineCore.outputText( 'swallowing it into your mouth without thinking.  You greedily guzzle the potent, narcotic aphrodisiac down, even going so far as to lick it from each of your fingers in turn, sucking every drop into your waiting gullet.' );
			} else {
				EngineCore.outputText( 'feeling your heart hammer lustily.' );
			}
			EngineCore.dynStats( 'lus', 15 + CoC.player.lib / 8 + CoC.player.sens / 8 );
		} else {
			EngineCore.outputText( ' right past your head, but the smell alone is enough to make you weak at the knees.' );
			EngineCore.outputText( '  The animalistic scent of it seems to get inside you, the musky aroma burning a path of liquid heat to your groin, stiffening your horse-cock to absurd degrees.' );
			EngineCore.dynStats( 'lus', 11 + CoC.player.lib / 10 );
		}
		//(1);
		if( CoC.player.lust <= 75 ) {
			EngineCore.outputText( '  You shiver with need, wanting nothing more than to bury your face under that loincloth and slurp out every drop of goopey goodness.' );
		} else {
			EngineCore.outputText( '  <b>You groan and lick your lips over and over, craving the taste of him in your mouth.</b>' );
		}
		Combat.combatRoundOver();
	};
	MinotaurLord.prototype.defeated = function() {
		MainView.clearOutput();
		EngineCore.outputText( 'The minotaur lord is defeated!  ' );
		EngineCore.outputText( '  You could use him for a quick fuck to sate your lusts before continuing on.  Do you?' );
		EngineCore.menu();
		EngineCore.addButton( 0, 'Fuck', SceneLib.urtaQuest, SceneLib.urtaQuest.winRapeAMinoLordAsUrta );
		EngineCore.addButton( 4, 'Leave', SceneLib.urtaQuest, SceneLib.urtaQuest.beatMinoLordOnToSuccubi );
	};
	MinotaurLord.prototype.won = function( hpVictory ) {
		if( hpVictory ) {
			SceneLib.urtaQuest.urtaLosesToMinotaurRoughVersion();
		} else {
			SceneLib.urtaQuest.urtaSubmitsToMinotaurBadEnd();
		}
	};
	MinotaurLord.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('MinotaurLord');
		that.a = 'the ';
		that.short = 'minotaur lord';
		that.imageName = 'minotaurlord';
		that.long = 'Across from you is the biggest minotaur you\'ve ever seen.  Fully eleven feet tall, this shaggy monstrosity has muscles so thick that they stand even through his thick, obscuring fur.  A leather collar with a tag indicates his status as \'pet\' though it seems completely out of place on the herculean minotaur.  His legs and arms are like thick tree trunks, imposing and implacable, flexing fiercely with every movement.  This can only be a minotaur lord, a minotaur of strength and virility far beyond his lesser brothers. In his hands, a massive chain swings, connected to his collar, but used as an impromptu weapon for now.  A simple loincloth girds his groin, though it does little to hide the massive, erect length that tents it.  It winds up looking more like a simple, cloth condom than any sort of clothing, and it drips long strings of musky pre-slime in ribbons onto the ground.  Below, heavy testes, each easily the size of a basketball, swing in a taut, sloshing sack.  You can almost smell the liquid bounty he has for you, and the musk he\'s giving off makes it seem like a good idea...';
		that.createCock( Utils.rand( 13 + 24 ), 2 + Utils.rand( 3 ), CockTypesEnum.HORSE );
		that.balls = 2;
		that.ballSize = 2 + Utils.rand( 13 );
		that.cumMultiplier = 1.5;
		that.hoursSinceCum = this.ballSize * 10;
		that.createBreastRow( 0 );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.createStatusAffect( StatusAffects.BonusACapacity, 50, 0, 0, 0 );
		that.tallness = Utils.rand( 37 ) + 84;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE + 1;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_HOOFED;
		that.skinTone = 'red';
		that.skinType = AppearanceDefs.SKIN_TYPE_FUR;
		that.skinDesc = 'shaggy fur';
		that.hairColor = Utils.randomChoice( 'black', 'brown' );
		that.hairLength = 3;
		that.faceType = AppearanceDefs.FACE_COW_MINOTAUR;
		that.initStrTouSpeInte( 125, 90, 30, 30 );
		that.initLibSensCor( 70, 25, 85 );
		that.weaponName = 'chain';
		that.weaponVerb = 'chain-whip';
		that.weaponAttack = 50;
		that.armorName = 'thick fur';
		that.bonusHP = 700;
		that.lust = 50;
		that.lustVuln = 0.33;
		that.temperment = Monster.TEMPERMENT_LUSTY_GRAPPLES;
		that.level = 15;
		that.gems = Utils.rand( 5 ) + 5;
		that.drop = Monster.NO_DROP;
		that.tailType = AppearanceDefs.TAIL_TYPE_COW;
		that.special1 = SceneLib.minotaurScene.minoPheromones;
		that.checkMonster();
	};
	return MinotaurLord;
} );