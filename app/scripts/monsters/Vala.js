'use strict';

angular.module( 'cocjs' ).factory( 'Vala', function( SceneLib, ConsumableLib, CoC, Appearance, kFLAGS, Combat, EngineCore, Utils, WeightedDrop, AppearanceDefs, Monster, StatusAffects ) {
	function Vala() {
		this.init(this, arguments);
	}
	angular.extend(Vala.prototype, Monster.prototype);
	//Vala AI;
	//Blood magic?;
	Vala.prototype.valaSpecial1 = function() {
		EngineCore.outputText( 'Vala dabs at one of her wounds and swoons.  Is she actually getting off from the wounds?  Damn she\'s damaged!  Vala licks the blood from her fingers, winks, and blows pink mist from her mouth.', false );
		//Lightly wounded.;
		if( this.HPRatio() > 0.7 ) {
			EngineCore.outputText( '  The sweet-smelling cloud rapidly fills the room, but the volume of mist is low enough that you don\'t end up breathing in that much of it.  It does make your pulse quicken in the most pleasant way though...', false );
			EngineCore.dynStats( 'lus', 5 + CoC.player.lib / 20 );
		} else if( this.HPRatio() > 0.4 ) {
			EngineCore.outputText( '  The rose-colored vapor spreads throughout the room, forcing you to breathe it in or pass out from lack of air.  It smells sweet and makes your head swim with sensual promises and your crotch tingle with desire.  Panicked by the knowledge that you\'re being drugged, you gasp, but it only draws more of the rapidly disappating cloud into your lungs, fueling your lust.', false );
			EngineCore.dynStats( 'lus', 10 + CoC.player.lib / 20 );
		} else {
			EngineCore.outputText( '  The cloying, thick cloud of pink spools out from her mouth and fills the room with a haze of bubblegum-pink sweetness.  Even the shallowest, most experimental breath makes your heart pound and your crotch thrum with excitement.  You gasp in another quick breath and sway back and forth on your feet, already on the edge of giving in to the faerie.', false );
			EngineCore.dynStats( 'lus', 30 + CoC.player.lib / 10 );
		}
		Combat.combatRoundOver();
	};
	//Milk magic;
	Vala.prototype.valaSpecial2 = function() {
		EngineCore.outputText( 'With a look of ecstasy on her face, Vala throws back her head and squeezes her pillowy chest with her hands, firing gouts of thick faerie milk from her over-sized bosom!  You try to dodge, but she\'s squirting so much it\'s impossible to dodge it all, and in no time you\'re drenched with a thick coating of Vala\'s milk.', false );
		EngineCore.outputText( '  She releases her breasts, shaking them back and forth for your benefit, and flutters her wings, blowing shiny, glitter-like flakes at you.  They stick to the milk on your skin, leaving you coated in milk and faerie-dust.', false );
		EngineCore.outputText( '\nVala says, "<i>Now you can be sexy like Vala!</i>"\n', false );
		if( this.findStatusAffect( StatusAffects.Milk ) >= 0 ) {
			this.addStatusValue( StatusAffects.Milk, 1, 5 );
			EngineCore.outputText( 'Your ' + CoC.player.skinDesc + ' tingles pleasantly, making you feel sexy and exposed.  Oh no!  It seems each coating of milk and glitter is stronger than the last!', false );
		} else {
			this.createStatusAffect( StatusAffects.Milk, 5, 0, 0, 0 );
			EngineCore.outputText( 'You aren\'t sure if there\'s something in her milk, the dust, or just watching her squirt and shake for you, but it\'s turning you on.', false );
		}
		EngineCore.dynStats( 'lus', this.statusAffectv1( StatusAffects.Milk ) + CoC.player.lib / 20 );
		Combat.combatRoundOver();
	};
	//Masturbation;
	Vala.prototype.valaMasturbate = function() {
		EngineCore.outputText( 'The mind-fucked faerie spreads her alabaster thighs and dips a finger into the glistening slit between her legs, sliding in and out, only pausing to circle her clit.  She brazenly masturbates, putting on quite the show.  Vala slides another two fingers inside herself and finger-fucks herself hard, moaning and panting lewdly.  Then she pulls them out and asks, "<i>Did you like that?  Will you fuck Vala now?</i>"', false );
		EngineCore.dynStats( 'lus', 4 + CoC.player.cor / 10 );
		Combat.combatRoundOver();
	};

	//[Fight dialog];
	Vala.prototype.valaCombatDialogue = function() {
		if( this.findStatusAffect( StatusAffects.Vala ) < 0 ) {
			EngineCore.outputText( '"<i>Sluts needs to service the masters!</i>" the fairy wails, flying high. "<i>If they are not pleased, Bitch doesn\'t get any cum!</i>"', false );
			this.createStatusAffect( StatusAffects.Vala, 0, 0, 0, 0 );
		} else {
			this.addStatusValue( StatusAffects.Vala, 1, 1 );
			if( this.statusAffectv1( StatusAffects.Vala ) === 1 ) {
				EngineCore.outputText( '"<i>If you won\'t fuck Bitch, you must not be a master,</i>" she realizes, the fight invigorating her lust-deadened brain. "<i>You get to be a pet for the masters, too!</i>"', false );
			} else if( this.statusAffectv1( StatusAffects.Vala ) === 2 ) {
				EngineCore.outputText( '"<i>If the masters like you, maybe they will let Bitch keep you for herself! Won\'t you like that?</i>"', false );
			} else if( this.statusAffectv1( StatusAffects.Vala ) === 3 ) {
				EngineCore.outputText( '"<i>We obey the masters. They fed Bitch until she became big enough to please them. The masters love their pets so much, you\'ll see.</i>"', false );
			} else if( this.statusAffectv1( StatusAffects.Vala ) === 4 ) {
				EngineCore.outputText( '"<i>Thoughts are so hard. Much easier to be a toy slut. Won\'t you like being a toy? All that nasty memory fucked out of your head.</i>"', false );
			} else if( this.statusAffectv1( StatusAffects.Vala ) === 5 ) {
				EngineCore.outputText( '"<i>Bitch has given birth to many of the masters\' children. She will teach you to please the masters. Maybe you can birth more masters for us to fuck?</i>"', false );
			} else {
				EngineCore.outputText( '"<i>Bitch loves when her children use her as their fathers did. Sluts belong to them. Slut love them. You will love them too!</i>"', false );
			}
		}
	};
	Vala.prototype.performCombatAction = function() {
		//VALA SPEAKS!;
		this.valaCombatDialogue();
		EngineCore.outputText( '\n\n', false );
		//Select Attack;
		//BLood magic special;
		if( this.HPRatio() < 0.85 && Utils.rand( 3 ) === 0 ) {
			this.valaSpecial1();
		}//25% chance of milksquirt.;
		else if( Utils.rand( 4 ) === 0 ) {
			this.valaSpecial2();
		} else {
			this.valaMasturbate();
		}
	};

	Vala.prototype.defeated = function() {
		SceneLib.dungeon2Supplimental.fightValaVictory();
	};
	Vala.prototype.won = function( hpVictory, pcCameWorms ) {
		if( pcCameWorms ) {
			EngineCore.outputText( '\n\nYour foe doesn\'t seem put off enough to leave...' );
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			SceneLib.dungeon2Supplimental.loseToVala();
		}
	};
	Vala.prototype.init = function(that, args) {
		Monster.prototype.init(that, args);
		that.a = '';
		that.short = 'Vala';
		that.imageName = 'vala';
		that.long = 'While the fey girl is whip-thin, her breasts are disproportionately huge. They\'d be at least a DD-cup on a normal human, but for her height and body type, they\'re practically as large as her head. They jiggle at her slow, uneven breathing, tiny drops of milk bubbling at her nipples with every heartbeat.  She seems fixated on mating with you, and won\'t take no for an answer.';
		that.createVagina( false, AppearanceDefs.VAGINA_WETNESS_SLICK, AppearanceDefs.VAGINA_LOOSENESS_GAPING_WIDE );
		that.createStatusAffect( StatusAffects.BonusVCapacity, 25, 0, 0, 0 );
		that.createBreastRow( Appearance.breastCupInverse( 'E' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_STRETCHED;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_DRY;
		that.createStatusAffect( StatusAffects.BonusACapacity, 10, 0, 0, 0 );
		that.tallness = 4 * 12;
		that.hipRating = AppearanceDefs.HIP_RATING_CURVY;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'fair';
		that.hairColor = 'purple';
		that.hairLength = 22;
		that.initStrTouSpeInte( 40, 50, 50, 60 );
		that.initLibSensCor( 55, 35, 50 );
		that.weaponName = 'fists';
		that.weaponVerb = 'caresses';
		that.armorName = 'skin';
		var lustVuln = 0.5;
		if( CoC.flags[ kFLAGS.TIMES_PC_DEFEATED_VALA ] > 0 ) {
			lustVuln += 0.25;
		}
		if( CoC.flags[ kFLAGS.TIMES_PC_DEFEATED_VALA ] > 2 ) {
			lustVuln += 0.5;
		}
		var lust = 30 + CoC.flags[ kFLAGS.TIMES_PC_DEFEATED_VALA ] * 10;
		if( lust > 80 ) {
			lust = 80;
		}
		that.bonusHP = 350;
		that.lust = lust;
		that.lustVuln = lustVuln;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 11;
		that.gems = 1;
		that.additionalXP = 50;
		if( CoC.flags[ kFLAGS.TIMES_PC_DEFEATED_VALA ] > 0 ) {
			that.XP = 5;
		}
		if( CoC.flags[ kFLAGS.TIMES_PC_DEFEATED_VALA ] > 2 ) {
			that.XP = 1;
		}
		that.special1 = null;
		that.special2 = null;
		that.special3 = null;
		var wingDesc = 'shimmering wings';
		if( CoC.flags[ kFLAGS.TIMES_PC_DEFEATED_VALA ] === 0 ) {
			that.drop = new WeightedDrop( ConsumableLib.NUMBROX );
		} else {
			that.drop = Monster.NO_DROP;
		}
		that.wingType = AppearanceDefs.WING_TYPE_BEE_LIKE_LARGE;
		that.wingDesc = wingDesc;
		that.checkMonster();
	};
	return Vala;
} );