'use strict';

angular.module( 'cocjs' ).factory( 'Minerva', function( SceneLib, CoC, kFLAGS, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Appearance, Combat, WeightedDrop, ConsumableLib ) {
	function Minerva() {
		this.init(this, arguments);
	}
	angular.extend(Minerva.prototype, Monster.prototype);
	//Normal Attacks for all Minerva Types
	//Shark-bite:
	Minerva.prototype.minervaBite = function() {
		EngineCore.outputText( 'The siren paces around you in circles, waiting for the right moment to strike.  Unexpectedly quick thanks to her clawed feet, she propels herself toward you at full speed.  Her maw opens wide to chomp on you, showing off multiple rows of glinting, razor-sharp teeth.' );
		var damage = Math.ceil( (this.str + 85) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '  You get out of the way just in time, this.Minerva making a loud chomping sound as she only catches the air.' );
		}
		//[else block]
		else if( damage <= 0 ) {
			EngineCore.outputText( '  Your hands lash out, knocking her head to the side as she tries to bite you.  With the bite deflected, this.Minerva makes a loud chomping sound as she only bites the air.' );
		}//[if attack lands]
		else {
			EngineCore.outputText( '  Her teeth dig right into your arm!  It\'s a bit of a struggle, but you\'re able to free yourself.  The damage doesn\'t look too serious. ' );
			damage = CoC.player.takeDamage( damage );
			EngineCore.outputText( '(' + damage + ')' );
		}
		Combat.combatRoundOver();
	};
	//Flying kick:
	Minerva.prototype.minervaKnowsKungfu = function() {
		EngineCore.outputText( 'The blue beauty flaps her wings and launches herself into the air.  Once she\'s gained as much altitude as she can, she dive-bombs you, her demon-clawed feet leading the attack.' );
		var damage = Math.ceil( (this.str + this.weaponAttack + 100) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		this.spe -= 70;
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '  You jump out of the landing zone just in time, piles of dirt exploding in all directions as Minerva slams into the ground.' );
		}
		//[else block]
		else if( damage <= 0 ) {
			EngineCore.outputText( '  Steadying yourself, you reach up, grabbing hold of Minerva as she attempts to land a heavy blow on you.  Grunting hard, you pull against her and toss the siren aside completely, halting her attack.' );
		}//[if attack lands]
		else {
			EngineCore.outputText( '  She hits you square in the chest, knocking you to the ground as her entire weight lands on you.  The bombshell of a woman jumps off your chest, ready to keep fighting.' );
			damage = CoC.player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
		this.spe += 70;
		Combat.combatRoundOver();
	};
	//Tail-whip
	Minerva.prototype.tailWhip = function() {
		var damage = Math.ceil( (this.str + 35) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		EngineCore.outputText( 'She runs at you, holding the weapon like she\'s about to chop into your side.  You brace yourself, but when she\'s only a few feet away, she starts to turn her body.' );
		//[else block]
		if( damage <= 0 ) {
			EngineCore.outputText( '  Lashing out with a fierce kick you intercept the tail-whip, your [foot] impacting against her strong appendage and totally neutralizing its momentum.' );
		}//[if attack lands]
		else {
			EngineCore.outputText( '  Her shark tail whacks you, knocking you to the ground.  You quickly struggle back into position' );
			if( CoC.player.armorDef > 0 ) {
				EngineCore.outputText( ', but your defense has been reduced' );
			}
			EngineCore.outputText( '!' );
			damage = CoC.player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
			if( this.findStatusAffect( StatusAffects.TailWhip ) >= 0 ) {
				this.addStatusValue( StatusAffects.TailWhip, 1, 10 );
			} else {
				this.createStatusAffect( StatusAffects.TailWhip, 10, 0, 0, 0 );
			}
		}
		Combat.combatRoundOver();
	};
	//Halberd stab:
	Minerva.prototype.minervaUsesHalberdStab = function() {
		EngineCore.outputText( 'Minerva charges at you, brandishing her halberd\'s sharp tip toward you.' );
		var damage = Math.ceil( (this.str + this.weaponAttack) - Utils.rand( CoC.player.tou ) );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '  You sidestep the attack just as she thrusts the point past your face.' );
		}//[else block]
		else if( damage < 0 ) {
			EngineCore.outputText( '  With all your strength, you swing your [weapon], the blow landing on the side of Minerva\'s halberd and deflecting the goring strike away from you.' );
		}//[if attack lands]
		else {
			EngineCore.outputText( '  She pierces you right in the shoulder!  You wince in pain and step back, out of her reach again.' );
			damage = CoC.player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
		Combat.combatRoundOver();
	};
	//Halberd CHOP:
	Minerva.prototype.minervaUsesHalberdCHOP = function() {
		EngineCore.outputText( 'She moves in close, practically right in front of you and raises the halberd.' );
		var damage = Math.ceil( (this.str + 100) - Utils.rand( CoC.player.tou ) - CoC.player.armorDef );
		if( Combat.combatMiss() || Combat.combatEvade() || Combat.combatFlexibility() || Combat.combatMisdirect() ) {
			EngineCore.outputText( '  You get out of the way quickly, her attack chopping deeply into the earth. ' );
		}//[else block]
		else if( damage < 0 ) {
			EngineCore.outputText( '  In a mad show of pure skill, you lift your hands, clamping them down on the cheeks of the halberd blade and stop Minerva\'s attack cold, bewildering the siren in the process.' );
		}//[if attack lands]
		else {
			EngineCore.outputText( '  You don\'t have time to avoid the downward chop and the axe head lands right in your shoulder blade!  You cry out in pain, but you can still move your arm despite the brutal blow.' );
			damage = CoC.player.takeDamage( damage );
			EngineCore.outputText( ' (' + damage + ')' );
		}
		Combat.combatRoundOver();
	};
	//White Fire
	Minerva.prototype.kiteFire = function() {
		EngineCore.outputText( 'The siren holds her hand out, flashing you a cunning smirk and snapping her fingers.  Your entire body is engulfed in white-hot flames, searing flesh and burning your [armor].  The sudden flash of heat and fire elicit panic from deep within you, causing you to cry out and roll on the ground to put the fires out.  The burns aren\'t too severe, but you know you can\'t keep getting hit like that!' );
		var damage = Math.ceil( 10 + (this.inte / 3 + Utils.rand( this.inte / 2 )) * 1.5 );
		damage = CoC.player.takeDamage( damage );
		EngineCore.outputText( ' (' + damage + ')' );
		Combat.combatRoundOver();
	};
	//Lust Attacks for tainted Minerva
	//Booty-shorts
	Minerva.prototype.bootyShortInYoFaceSon = function() {
		EngineCore.outputText( 'The blue beauty turns around and bends over so far that she uses her halberd like a pole to support herself.  She lifts her shark tail up so you can see her short-shorts hugging perfectly against her ample bottom.  Her tail waves to the left and to the right as she does a little booty shake for you.  The siren gives her big ass a nice, hard slap that echoes off the tower walls, and making it jiggle even more.  She quickly turns around to face you, smirking at what she just did.' );
		EngineCore.dynStats( 'lus', 20 + CoC.player.lib / 10 + Utils.rand( 5 ) );
		Combat.combatRoundOver();
	};
	//Lust Attacks for all Minervas
	//Pole licking
	Minerva.prototype.lickDatPole = function() {
		EngineCore.outputText( 'Minerva stands, holding her halberd straight up next to her as she looks it over with a seductive stare.  Giving you a suggestive look she rolls out a two-foot long tongue from her mouth, licking a good length of the massive weapon, even wrapping her tongue around it a few times.  Suddenly she sucks her tongue back into her mouth and gives you a little smirk, almost to say "<i>Yeah, I can do that... and more.</i>"' );
		EngineCore.dynStats( 'lus', 20 + CoC.player.lib / 10 + Utils.rand( 5 ) );
		Combat.combatRoundOver();
	};
	//Special attack
	Minerva.prototype.sirensSong = function() {
		//The Siren's Song (2-part attack) (Rarely used or when she's desperate aka: Less than 10% hp)
		//[part 1]
		if( this.findStatusAffect( StatusAffects.SirenSong ) < 0 ) {
			EngineCore.outputText( 'Minerva begins to hum a pleasant tune.  It might be better to stand back to see what she\'s up to!' );
			this.createStatusAffect( StatusAffects.SirenSong, 0, 0, 0, 0 );
		}
		//[part 2]
		else {
			EngineCore.outputText( 'Her hum becomes a song.  A magnificent song without words, a sound that should be impossible for any human, or creature for that matter, to make naturally.' );
			//If wait:
			if( CoC.flags[ kFLAGS.IN_COMBAT_USE_PLAYER_WAITED_FLAG ] === 1 ) {
				EngineCore.outputText( '  You cover your ears before she even opens her lips, wary of its power.  Judging by the dim feeling of pleasure simmering through you with the little sound you\'re picking up regardless, it probably was for the better.' );
			}//No wait - insta loss:
			else {
				EngineCore.outputText( '  Your mind clouds over as the song flows through your ears and fills your mind with sweet bliss.  You lower your [weapon] and dreamily walk into the siren\'s sweet embrace.  You absent-mindedly disrobe yourself as you move in closer, the song getting louder with each step you take, until you finally bury yourself into the siren\'s soft bosom and she wraps her feathery arms around your body.  She stops singing her beautiful song and whispers into your ear, "<i>You\'re all mine now.</i>"' );
				CoC.player.lust = 100;
			}
			this.removeStatusAffect( StatusAffects.SirenSong );
		}
		Combat.combatRoundOver();
	};
	Minerva.prototype.performCombatAction = function() {
		if( this.findStatusAffect( StatusAffects.SirenSong ) >= 0 ) {
			this.sirensSong();
		} else if( Utils.rand( 25 ) === 0 || (this.HP < 100 && Utils.rand( 2 ) === 0) ) {
			this.sirensSong();
		}//Else choose randomly!
		else {
			var choices = [ this.lickDatPole,
				this.bootyShortInYoFaceSon,
				this.kiteFire,
				this.minervaUsesHalberdCHOP,
				this.minervaUsesHalberdStab,
				this.tailWhip,
				this.minervaKnowsKungfu,
				this.minervaBite ];
			choices[ Utils.rand( choices.length ) ]();
		}
	};
	Minerva.prototype.defeated = function(){
		SceneLib.minervaScene.beatUpDatSharpie();
	};
	Minerva.prototype.won = SceneLib.minervaScene.loseToMinerva;
	Minerva.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('Minerva');
		that.a = '';
		that.short = 'Minerva';
		that.imageName = 'minerva';
		that.long = 'You\'re fighting the tainted siren, Minerva.  Standing around eight feet and wielding a weapon just as tall, she is a force to be reckoned with.  Her skin is a dark navy blue, though her belly, neck and inner thighs are as white as the clouds in the sky, and a golden piecing decorates her navel.  Orange and white stripes adorn her legs, tail and back.  Two large wings sprout from her back, their feathers an attention-grabbing red and orange mix.  She wears a tube-top that hold back her double d-cups, and short shorts around her wide waist that seem to be holding back a huge bulge.\n\nHer weapon is a halberd, made from a shiny, silvery metal, and seems to have an unnatural glow to it.';
		that.createCock( 16, 3 );
		that.balls = 2;
		that.ballSize = 3;
		that.cumMultiplier = 3;
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_NORMAL );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_TIGHT;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.tallness = 8 * 12 + 4;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE + 1;
		that.skinTone = 'blue';
		that.hairColor = 'red';
		that.hairLength = 25;
		that.initStrTouSpeInte( 50, 65, 95, 75 );
		that.initLibSensCor( 30, 25, 45 );
		that.weaponName = 'halberd';
		that.weaponVerb = 'slash';
		that.weaponAttack = 30;
		that.weaponPerk = '';
		that.weaponValue = 150;
		that.armorName = 'comfortable clothes';
		that.armorDef = 1;
		that.armorPerk = '';
		that.armorValue = 5;
		that.bonusHP = 470;
		that.lust = 20;
		that.lustVuln = 0.2;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 16;
		that.gems = Utils.rand( 25 ) + 10;
		that.additionalXP = 50;
		that.drop = new WeightedDrop( ConsumableLib.PURPEAC, 1 );
		that.wingType = AppearanceDefs.WING_TYPE_HARPY;
		that.wingDesc = 'fluffy feathery';
		that.checkMonster();
	};
	return Minerva;
} );