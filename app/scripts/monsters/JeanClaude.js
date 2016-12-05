'use strict';

angular.module( 'cocjs' ).factory( 'JeanClaude', function( SceneLib, CockTypesEnum, EngineCore, CoC, Monster, AppearanceDefs, StatusAffects, Utils, Combat ) {
	function JeanClaude() {
		this.init(this, arguments);
	}
	angular.extend(JeanClaude.prototype, Monster.prototype);
	JeanClaude.prototype.doubleAttack = function() {
		EngineCore.outputText( 'The monstrous basilisk suddenly lunges forward, snarling wordlessly as he swings his cutlass at you twice, the blows of a savage yet expert swordsman.\n\n' );
		this.createStatusAffect( StatusAffects.Attacks, 2, 0, 0, 0 );
		this.eAttack();
		Combat.combatRoundOver();
	};
	JeanClaude.prototype.doAI = function() {
		this.doubleAttack();
	};
	JeanClaude.prototype.defeated = function( hpVictory ) {
		SceneLib.jeanClaudeScenes.beatDaFuckhugeBasilisk( hpVictory );
	};
	JeanClaude.prototype.won = function( hpVictory ) {
		SceneLib.jeanClaudeScenes.fuckhugeBasiliskFuckedYouUp( hpVictory );
	};
	JeanClaude.prototype.handleTease = function( lustDelta, successful ) {
		if( CoC.player.findStatusAffect( StatusAffects.RemovedArmor ) < 0 ) {
			EngineCore.outputText( '\n\nJean-Claude stops circling you, looking mildly surprised as you attempt to entice him with your body.' );
			EngineCore.outputText( '\n\n“<i>This is the legendary Champion of Ignam?</i>” he husks. “<i>Flaunting themselves like the most amateur of Lethice’s strippers?</i>” His eyes glow orange. “<i>If that was your intent all along, interloper, you should not do it so half-assedly. You should take off all your clothes, embrace what you truly are, show me what you are really made of.</i>” The hypnotic compulsion presses upon you, commanding you to raise your hands to your [armor]’s clasps...' );
			if( !successful ) {
				EngineCore.outputText( '\n\nYou grit your teeth, resist, and tear your hands away from your clothes. Jean-Claude snorts dismissively, gripping his cutlass anew.' );
			} else {
				EngineCore.outputText( '\n\nYour intent is to arouse this creature. Surely the most arousing thing you can do right now is to take off all of your clothes. You smile at him, your eyes half-lidded as you slowly, sexily slide out of your [armor], pushing your [butt] out and sucking on a finger as you loosen first the top half, then the bottom half, letting it all slide off, piece by piece. The basilisk stands back and watches, grinning, his eyes a bonfire of lust, gripping one of his girthy dicks and slowly masturbating as you kick your underclothes outwards, smouldering at him and arching your back to display your [chest].' );
				EngineCore.outputText( '\n\n“<i>Very nice, interloper,</i>” Jean-Claude breathes. His wide smile turns ugly. “<i>Look forward to seeing that every night. I hope it is not too chilly in here for you.</i>” The basilisks which surround you snigger and you blink, the scales falling from your eyes as you realize what you have just done. There is no time to claw your clothes back on is upon you, forcing you to fall back, and you will have to fight the rest of this battle in the buff!' );
				// (JC arousal up one level, PC’s armor removed for rest of battle);
				CoC.player.createStatusAffect( StatusAffects.RemovedArmor, 0, 0, 0, 0 );
				if( this.findStatusAffect( StatusAffects.JCLustLevel ) < 0 ) {
					this.createStatusAffect( StatusAffects.JCLustLevel, 1, 0, 0, 0 );
					this.lustVuln += 0.1;
				} else {
					this.addStatusValue( StatusAffects.JCLustLevel, 1, 1 );
				}
				this.applyTease( lustDelta );
				EngineCore.dynStats( 'lus+', 20 );
			}
		} else {
			EngineCore.outputText( '\n\n“<i>Even when made the fool, still you try it, still you think you can entice me with things I have seen a thousand times before,</i>” Jean-Claude sighs. “<i>Why not give up, interloper? You do these things because they arouse YOU, not because you hope they arouse me. Give up, and embrace the life you were born to lead.</i>” Despite these words his hungry eyes remain on your body. Perhaps he can’t help it. You can only hope...' );
			if( successful ) {
				this.applyTease( lustDelta );
			}
			EngineCore.dynStats( 'lus+', 20 );
		}
	};
	JeanClaude.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('JeanClaude');
		that.a = '';
		that.short = 'Jean-Claude';
		that.imageName = 'jeanclaude';
		that.long = 'You are fighting Jean-Claude. He stands over seven feet tall and has a perfect frame, padded with hard, defined muscle despite not looking heavy on his feet in the slightest; the way he circles you, his thighs tensing and relaxing, his powerful tail swishing, ready to spring forward at the first hint of an opening, makes a deep, monkey part of your brain panic, warning you that you are battling an apex predator in his prime. He is dressed in a leather tunic, a bronze cuirass and a centurion’s helmet that combine to give him even more protection than his thick, green and purple mottled hide otherwise would. His eyes glow with a depthless yellow light, endlessly catching your own, enticing you to look further into them. He wields a stained-looking cutlass, which he swings by his side with mocking casualness as he moves; it mimics the movement of his dual, tumescent purple cocks, swaying beneath his tunic in crude suggestion.';
		that.plural = false;
		that.createCock( 12, 2, CockTypesEnum.LIZARD );
		that.balls = 2;
		that.ballSize = 6;
		that.hoursSinceCum = 9999;
		that.createBreastRow( 0 );
		that.tallness = 86;
		that.ass.analLooseness = 0;
		that.ass.analWetness = 0;
		that.hipRating = AppearanceDefs.HIP_RATING_AVERAGE;
		that.buttRating = AppearanceDefs.BUTT_RATING_AVERAGE;
		that.lowerBody = AppearanceDefs.LOWER_BODY_TYPE_LIZARD;
		that.skinDesc = 'green-purple mottled hide';
		that.initStrTouSpeInte( 80, 100, 80, 60 );
		that.initLibSensCor( 40, 40, 80 );
		that.faceType = AppearanceDefs.FACE_LIZARD;
		that.weaponName = 'cutlass';
		that.weaponVerb = 'slash';
		that.weaponAttack = 20;
		that.bonusHP = 400;
		that.armorName = 'leather tunic';
		that.lustVuln = 0.6;
		that.armorDef = 20;
		that.lust = 5;
		that.level = 20;
		that.gems = 300 + Utils.rand( 55 );
		that.drop = Monster.NO_DROP;
		that.checkMonster();
	};
	return JeanClaude;
} );