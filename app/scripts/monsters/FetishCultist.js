'use strict';

angular.module( 'cocjs' ).factory( 'FetishCultist', function( $log, SceneLib, CoC, EngineCore, Monster, Utils, AppearanceDefs, StatusAffects, Combat, Descriptors, WeightedDrop, ConsumableLib, Appearance, WeaponLib ) {
	function FetishCultist() {
		this.init(this, arguments);
	}
	angular.extend(FetishCultist.prototype, Monster.prototype);
	var NAUGHTY_NURSES_UNIFORM = 'naughty nurse\'s uniform';
	var TEACHERS_OUTFIT = 'teacher\'s outfit';
	var SWIMSUIT = 'swimsuit';
	var NOBLES_CLOTHING = 'noble\'s clothing';
	var PERVY_NUNS_CLOTHING = 'pervy nun\'s clothing';
	FetishCultist.prototype._superCombatRoundUpdate = FetishCultist.prototype.combatRoundUpdate;
	FetishCultist.prototype.combatRoundUpdate = function() {
		this._superCombatRoundUpdate();
		var changed = false;
		//Fetish Cultist Update
		switch( Utils.rand( 5 ) ) {
			case 0:
				if( this.armorName !== PERVY_NUNS_CLOTHING ) {
					//Religious outfit!
					this.long = 'The woman across from you has her eyes closed, her hands joined, and seems to be chanting under her breath.  She is wearing a religious robe that closely hugs her curvacious shape. There is a specially-placed opening over her pussy lips.';
					this.armorName = PERVY_NUNS_CLOTHING;
					changed = true;
				}
				break;
			case 1:
				if( this.armorName !== NOBLES_CLOTHING ) {
					//Noble outfit
					this.armorName = NOBLES_CLOTHING;
					this.long = 'She\'s wearing a skimpy noble\'s dress, which lets you get a good look at her well-filled bra through an over-generous cleavage. Her skirt is so short that you clearly see her pussy lips.  She smiles at you in a rather cute way.  She looks like she\'s coming out of a painting, executed by a rather depraved and lust-filled artist.';
					changed = true;
				}
				break;
			case 2:
				if( this.armorName !== SWIMSUIT ) {
					//Swim outfit
					this.long = 'She\'s currently wearing a swimsuit that\'s apparently much too small for her, because it stretches across every curve and clearly outlines them for you to see.  Her sizable breasts look like they could burst through the fabric at any moment.  You can even see her erect nipples and her puffy lower lips.';
					this.armorName = SWIMSUIT;
					changed = true;
				}
				break;
			case 3:
				if( this.armorName !== TEACHERS_OUTFIT ) {
					//Pervy Teacher
					this.long = 'She\'s now wearing a teacher\'s outfit, complete with glasses, make-up, her black hair in a tight bun, and a serious-looking outfit... with no back side at all.  She turns to the side to give you a good look at her rear, smiling mischievously.';
					this.armorName = TEACHERS_OUTFIT;
					changed = true;
				}
				break;
			case 4:
				if( this.armorName !== NAUGHTY_NURSES_UNIFORM ) {
					//Naughty Nurse
					this.long = 'The woman is wearing heavy make-up and a whorish nurse\'s suit, seemingly in white latex with two openings at her breasts and a large one on her crotch and inner thighs. It lets her blood-gorged pussy lips hang freely, which she displays proudly.';
					this.armorName = NAUGHTY_NURSES_UNIFORM;
					changed = true;
				}
				break;
		}
		//Talk abouts it mang!
		if( changed ) {
			EngineCore.outputText( 'The fetish cultist\'s clothing shifts and twists, taking on the appearance of a ' + this.armorName + '.\n\n', false );
		}
		this.lust += this.lustVuln * 3;
	};
	var FETISHY_OUTFIT = 'fetishy outfit';
	FetishCultist.prototype.cultistRaisePlayerLust = function() {
		//Two text variants!
		if( Utils.rand( 2 ) === 0 ) {
			if( this.armorName === PERVY_NUNS_CLOTHING ) {
				EngineCore.outputText( 'She suddenly stops chanting and spreads her legs, opening her loose pussy wide with one hand while moaning like a whore.  She toys with her breasts and fondles one of her nipples with her other hand.\n\nDespite yourself,  you can\'t help but be aroused by the scene.', false );
			}
			if( this.armorName === NOBLES_CLOTHING ) {
				EngineCore.outputText( 'She suddenly blushes and start giggling, saying: \'Really my lord!\' in a suave, submitting voice while pulling down her skirt.  The movement lets you get an even better look down her cleavage, and her breasts appear even fuller than before.\n\nDespite yourself, you can\'t help but be aroused by the scene.', false );
			}
			if( this.armorName === SWIMSUIT ) {
				EngineCore.outputText( 'She does a series of lewd stretches, showing off her tightly-clad, sexy body in every possible detail.  In particular, her excited, blood-gorged pussy lips, clearly outlined, seem to be begging for you to come and grope them... and that\'s just for a start.  Despite yourself, you can\'t help but be aroused by the scene.', false );
			}
			if( this.armorName === TEACHERS_OUTFIT ) {
				EngineCore.outputText( 'Obviously very flexible, she arches her back with one hand on her hip, displaying her firm round ass while looking at you with a lascivious expression.  She says in a sexy voice, "<i>Maybe we should have a... private talk after class...</i>"  Despite yourself, you can\'t help but be aroused by the scene.', false );
			}
			if( this.armorName === NAUGHTY_NURSES_UNIFORM ) {
				EngineCore.outputText( 'Still displaying her figure in her tight suit, she asks with a lewd smile, "<i>Is there one of your needs I could satisfy, my dear?</i>"  She grabs one of her firm, full breasts, "<i>Are you thirsty, maybe?</i>"  Despite yourself, you can\'t help but be aroused by the scene.', false );
			}
			if( this.armorName === FETISHY_OUTFIT ) {
				EngineCore.outputText( 'She suddenly starts posing in sexy outfits.  Despite yourself, you can\'t help but be aroused by it.', false );
			}
		} else {
			EngineCore.outputText( 'She suddenly starts mauling her shapely breasts, her fingers nearly disappearing briefly in the soft, full flesh, while fingering herself eagerly, emitting a variety of lewd noises.  You are entranced by the scene, the sexual excitement she\'s experiencing penetrating your body in warm waves coming from your groin.', false );
		}
		EngineCore.dynStats( 'lus', (CoC.getInstance().player.lib / 10 + CoC.getInstance().player.cor / 20) + 4 );
		if( CoC.getInstance().player.lust >= 100 ) {
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			EngineCore.doNext( Combat.combatMenu );
		}
	};
	FetishCultist.prototype.cultistLustTransfer = function() {
		if( this.lust <= 30 || Utils.rand( 2 ) === 0 ) {
			EngineCore.outputText( 'Her eyes glaze over, ', false );
			if( CoC.getInstance().player.cor < 40 ) {
				EngineCore.outputText( 'and you\'re almost afraid to know ', false );
			} else {
				EngineCore.outputText( 'and you wish you knew ', false );
			}
			EngineCore.outputText( 'what she is thinking of since you can almost feel her own lust building.', false );
			this.lust += 10;
		} else {
			EngineCore.outputText( 'Her eyes glaze over and you feel your mind suddenly becoming filled with a blur of every sexual perversion you could possibly think of, and then some.', false );
			if( CoC.getInstance().player.vaginas.length > 0 ) {
				EngineCore.outputText( '  You feel your ' + Descriptors.vaginaDescript( 0 ) + ' soaking itself in a sudden burst', false );
				if( CoC.getInstance().player.cockTotal() > 0 ) {
					EngineCore.outputText( ', while a sudden influx of pre-cum blurts out and streams down your ' + CoC.getInstance().player.multiCockDescriptLight() + ', painfully hardened by a vast amount of blood rushing to your groin', false );
				}
				EngineCore.outputText( '.', false );
			} else if( CoC.getInstance().player.cockTotal() > 0 ) {
				EngineCore.outputText( '  A sudden influx of pre-cum blurts out and streams down your ' + CoC.getInstance().player.multiCockDescriptLight() + ', painfully hardened by a vast amount of blood rushing to your groin.', false );
			}
			if( CoC.getInstance().player.gender === 0 ) {
				EngineCore.outputText( '  Your genderless body is suddenly filled by a perverted warmth.', false );
			}
			EngineCore.outputText( '\n\nYou notice that the young woman seems to have calmed down some.', false );
			EngineCore.dynStats( 'lus', (this.lust / 3 * (1 + CoC.getInstance().player.cor / 300)) );
			this.lust -= 50;
			if( this.lust < 0 ) {
				this.lust = 10;
			}
		}
		if( CoC.getInstance().player.lust >= 100 ) {
			EngineCore.doNext( Combat.endLustLoss );
		} else {
			EngineCore.doNext( Combat.combatMenu );
		}
	};

	FetishCultist.prototype.defeated = function( hpVictory ) {
		var temp2 = null;
		if( CoC.getInstance().player.findStatusAffect( StatusAffects.Feeder ) >= 0 ) {
			temp2 = SceneLib.fetishCultistScene.fetishCultistHasAMilkFetish;
		}
		if( hpVictory ) {
			EngineCore.outputText( 'Hurt too much to continue controlling her powers, the cultist collapses helplessly.', true );
		} else {
			EngineCore.outputText( 'Overwhelmed by her lusts, the cultist loses the ability to control herself and collapses.', true );
		}
		if( CoC.getInstance().player.lust >= 33 && CoC.getInstance().player.gender > 0 ) {
			EngineCore.outputText( '  You realize she\'d make a perfect receptacle for your lusts.  Do you have your way with her?', false );
			EngineCore.choices( 'Sex', SceneLib.fetishCultistScene.playerRapesCultist, '', null, '', null, 'B. Feed', temp2, 'Leave', Combat.cleanupAfterCombat );
		} else {
			if( temp2 !== null ) {
				EngineCore.outputText( '  She looks like she might take some of your milk if you offered it to her.  What do you do?', false );
				EngineCore.choices( 'B. Feed', temp2, '', null, '', null, '', null, 'Leave', Combat.cleanupAfterCombat );
			} else {
				Combat.cleanupAfterCombat();
			}
		}
	};
	FetishCultist.prototype._superWon = FetishCultist.prototype.won;
	FetishCultist.prototype.won = function( hpVictory, pcCameWorms ) {
		if( hpVictory ) {
			this._superWon( hpVictory, pcCameWorms );
		} else {
			if( pcCameWorms ) {
				EngineCore.outputText( '\n\nThe cultist giggles as she watches you struggling.\n\n', false );
			}
			SceneLib.fetishCultistScene.cultistRapesYou();
		}
	};
	FetishCultist.prototype.performCombatAction = function() {
		Utils.randomChoice( this.special1, this.special2 )();
	};
	FetishCultist.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		$log.debug( 'FetishCultist Constructor!' );
		that.a = 'the ';
		that.short = 'fetish cultist';
		that.imageName = 'fetishcultist';
		that.long = 'The woman across from you has her eyes closed, her hands joined, and seems to be chanting under her breath. She is wearing a religious outfit that closely hugs her curvacious shape, with a skirt so short that you can clearly see her pussy\'s lips.\n\nShe has clealy lost her grasp on sanity, and filled the void with pure perversion.';
		that.createVagina( false, AppearanceDefs.VAGINA_LOOSENESS_GAPING, AppearanceDefs.VAGINA_WETNESS_WET );
		that.createBreastRow( Appearance.breastCupInverse( 'DD' ) );
		that.ass.analLooseness = AppearanceDefs.ANAL_LOOSENESS_NORMAL;
		that.ass.analWetness = AppearanceDefs.ANAL_WETNESS_NORMAL;
		that.tallness = 5 * 12 + 7;
		that.hipRating = AppearanceDefs.HIP_RATING_AMPLE;
		that.buttRating = AppearanceDefs.BUTT_RATING_LARGE;
		that.skinTone = 'pale';
		that.hairColor = 'black';
		that.hairLength = 15;
		that.initStrTouSpeInte( 35, 25, 30, 1 );
		that.initLibSensCor( 75, 80, 90 );
		that.weaponName = 'whip';
		that.weaponVerb = 'whip-crack';
		that.armorName = FETISHY_OUTFIT;
		that.lust = 25;
		that.temperment = Monster.TEMPERMENT_LOVE_GRAPPLES;
		that.level = 2;
		that.gems = 5 + Utils.rand( 10 );
		that.drop = new WeightedDrop().add( ConsumableLib.LABOVA_, 1 )
			.add( WeaponLib.RIDINGC, 1 )
			.add( ConsumableLib.OVIELIX, 2 )
			.add( ConsumableLib.L_DRAFT, 6 );
		that.special1 = that.cultistRaisePlayerLust;
		that.special2 = that.cultistLustTransfer;
		that.checkMonster();
	};
	return FetishCultist;
} );