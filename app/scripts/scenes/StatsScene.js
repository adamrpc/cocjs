'use strict';

angular.module('cocjs').run( function (SceneLib, CoC, EngineCore, MainView, StatusAffects, kFLAGS, PerkLib) {
	function StatsScene() {}
	//MainMenu - kicks player out to the main menu
	StatsScene.prototype.displayStats = function( ) {
		MainView.spriteSelect( -1 );
		MainView.outputText( '', true );
		// Begin Combat Stats
		var combatStats = '';
		if( CoC.player.hasKeyItem( 'Bow' ) >= 0 ) {
			combatStats += '<b>Bow Skill:</b> ' + Math.round( CoC.player.statusAffectv1( StatusAffects.Kelt ) ) + '\n';
		}
		combatStats += '<b>Lust Resistance:</b> ' + (100 - Math.round( EngineCore.lustPercent() )) + '% (Higher is better.)\n';
		combatStats += '<b>Spell Effect Multiplier:</b> ' + (100 * CoC.player.spellMod()) + '%\n';
		combatStats += '<b>Spell Cost:</b> ' + EngineCore.spellCost( 100 ) + '%\n';
		if( CoC.flags[ kFLAGS.RAPHAEL_RAPIER_TRANING ] > 0 ) {
			combatStats += '<b>Rapier Skill (Out of 4):</b> ' + CoC.flags[ kFLAGS.RAPHAEL_RAPIER_TRANING ] + '\n';
		}
		combatStats += '<b>Tease Skill (Out of 5):</b>  ' + CoC.player.teaseLevel + '\n';
		if( combatStats !== '' ) {
			MainView.outputText( '<b><u>Combat Stats</u></b>\n' + combatStats, false );
		}
		// End Combat Stats
		// Begin Children Stats
		var childStats = '';
		if( CoC.player.statusAffectv1( StatusAffects.Birthed ) > 0 ) {
			childStats += '<b>Times Given Birth:</b> ' + CoC.player.statusAffectv1( StatusAffects.Birthed ) + '\n';
		}
		if( CoC.flags[ kFLAGS.AMILY_MET ] > 0 ) {
			childStats += '<b>Litters With Amily:</b> ' + (CoC.flags[ kFLAGS.AMILY_BIRTH_TOTAL ] + CoC.flags[ kFLAGS.PC_TIMES_BIRTHED_AMILYKIDS ]) + '\n';
		}
		if( CoC.flags[ kFLAGS.BENOIT_EGGS ] > 0 ) {
			childStats += '<b>Benoit Eggs Laid:</b> ' + CoC.flags[ kFLAGS.BENOIT_EGGS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.COTTON_KID_COUNT ] > 0 ) {
			childStats += '<b>Children With Cotton:</b> ' + CoC.flags[ kFLAGS.COTTON_KID_COUNT ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] > 0 ) {
			childStats += '<b>Children With Edryn:</b> ' + CoC.flags[ kFLAGS.EDRYN_NUMBER_OF_KIDS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EMBER_CHILDREN_MALES ] > 0 ) {
			childStats += '<b>Ember Offspring (Males):</b> ' + CoC.flags[ kFLAGS.EMBER_CHILDREN_MALES ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EMBER_CHILDREN_FEMALES ] > 0 ) {
			childStats += '<b>Ember Offspring (Females):</b> ' + CoC.flags[ kFLAGS.EMBER_CHILDREN_FEMALES ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EMBER_CHILDREN_HERMS ] > 0 ) {
			childStats += '<b>Ember Offspring (Herms):</b> ' + CoC.flags[ kFLAGS.EMBER_CHILDREN_HERMS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.EMBER_EGGS ] > 0 ) {
			childStats += '<b>Ember Eggs Produced:</b> ' + CoC.flags[ kFLAGS.EMBER_EGGS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.IZMA_CHILDREN_SHARKGIRLS ] > 0 ) {
			childStats += '<b>Children With Izma (Sharkgirls):</b> ' + CoC.flags[ kFLAGS.IZMA_CHILDREN_SHARKGIRLS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.IZMA_CHILDREN_TIGERSHARKS ] > 0 ) {
			childStats += '<b>Children With Izma (Tigersharks):</b> ' + CoC.flags[ kFLAGS.IZMA_CHILDREN_TIGERSHARKS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.KELLY_KIDS_MALE ] > 0 ) {
			childStats += '<b>Children With Kelly (Males):</b> ' + CoC.flags[ kFLAGS.KELLY_KIDS_MALE ] + '\n';
		}
		if( CoC.flags[ kFLAGS.KELLY_KIDS ] - CoC.flags[ kFLAGS.KELLY_KIDS_MALE ] > 0 ) {
			childStats += '<b>Children With Kelly (Females):</b> ' + (CoC.flags[ kFLAGS.KELLY_KIDS ] - CoC.flags[ kFLAGS.KELLY_KIDS_MALE ]) + '\n';
		}
		if( SceneLib.salon.lynnetteApproval() !== 0 ) {
			childStats += '<b>Lynnette Children:</b> ' + CoC.flags[ kFLAGS.LYNNETTE_BABY_COUNT ] + '\n';
		}
		if( CoC.flags[ kFLAGS.MARBLE_KIDS ] > 0 ) {
			childStats += '<b>Children With Marble:</b> ' + CoC.flags[ kFLAGS.MARBLE_KIDS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.ANT_KIDS ] > 0 ) {
			childStats += '<b>Ant Children With Phylla:</b> ' + CoC.flags[ kFLAGS.ANT_KIDS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.PHYLLA_DRIDER_BABIES_COUNT ] > 0 ) {
			childStats += '<b>Drider Children With Phylla:</b> ' + CoC.flags[ kFLAGS.PHYLLA_DRIDER_BABIES_COUNT ] + '\n';
		}
		if( CoC.flags[ kFLAGS.SHEILA_JOEYS ] > 0 ) {
			childStats += '<b>Children With Sheila (Joeys):</b> ' + CoC.flags[ kFLAGS.SHEILA_JOEYS ] + '\n';
		}
		if( CoC.flags[ kFLAGS.SHEILA_IMPS ] > 0 ) {
			childStats += '<b>Children With Sheila (Imps):</b> ' + CoC.flags[ kFLAGS.SHEILA_IMPS ] + '\n';
		}
		var sophie = 0;
		if( CoC.flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ] > 0 || CoC.flags[ kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER ] > 0 ) {
			childStats += '<b>Children With Sophie:</b> ';
			if( CoC.flags[ kFLAGS.SOPHIE_DAUGHTER_MATURITY_COUNTER ] > 0 ) {
				sophie++;
			}
			sophie += CoC.flags[ kFLAGS.SOPHIE_ADULT_KID_COUNT ];
			if( CoC.flags[ kFLAGS.SOPHIE_CAMP_EGG_COUNTDOWN ] > 0 ) {
				sophie++;
			}
			childStats += sophie + '\n';
		}
		if( CoC.flags[ kFLAGS.SOPHIE_EGGS_LAID ] > 0 ) {
			childStats += '<b>Eggs Fertilized For Sophie:</b> ' + (CoC.flags[ kFLAGS.SOPHIE_EGGS_LAID ] + sophie) + '\n';
		}
		if( CoC.flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] > 0 ) {
			childStats += '<b>Children With Tamani:</b> ' + CoC.flags[ kFLAGS.TAMANI_NUMBER_OF_DAUGHTERS ] + ' (after all forms of natural selection)\n';
		}
		if( SceneLib.urtaPregs.urtaKids() > 0 ) {
			childStats += '<b>Children With Urta:</b> ' + SceneLib.urtaPregs.urtaKids() + '\n';
		}
		//Mino sons
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] > 0 ) {
			childStats += '<b>Number of Adult Minotaur Offspring:</b> ' + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00326 ] + '\n';
		}
		if( childStats !== '' ) {
			MainView.outputText( '\n<b><u>Children</u></b>\n' + childStats, false );
		}
		// End Children Stats
		// Begin Body Stats
		var bodyStats = '';
		bodyStats += '<b>Anal Capacity:</b> ' + Math.round( CoC.player.analCapacity() ) + '\n';
		bodyStats += '<b>Anal Looseness:</b> ' + Math.round( CoC.player.ass.analLooseness ) + '\n';
		bodyStats += '<b>Fertility (Base) Rating:</b> ' + Math.round( CoC.player.fertility ) + '\n';
		bodyStats += '<b>Fertility (With Bonuses) Rating:</b> ' + Math.round( CoC.player.totalFertility() ) + '\n';
		if( CoC.player.cumQ() > 0 ) {
			bodyStats += '<b>Cum Production:</b> ' + Math.round( CoC.player.cumQ() ) + 'mL\n';
		}
		if( CoC.player.lactationQ() > 0 ) {
			bodyStats += '<b>Milk Production:</b> ' + Math.round( CoC.player.lactationQ() ) + 'mL\n';
		}
		if( CoC.player.findStatusAffect( StatusAffects.Feeder ) >= 0 ) {
			bodyStats += '<b>Hours Since Last Time Breastfed Someone:</b>  ' + CoC.player.statusAffectv2( StatusAffects.Feeder );
			if( CoC.player.statusAffectv2( StatusAffects.Feeder ) >= 72 ) {
				bodyStats += ' (Too long! Sensitivity Increasing!)';
			}
			bodyStats += '\n';
		}
		bodyStats += '<b>Pregnancy Speed Multiplier:</b> ';
		var preg = 1;
		if( CoC.player.findPerk( PerkLib.Diapause ) ) {
			bodyStats += '? (Variable due to Diapause)\n';
		} else {
			if( CoC.player.findPerk( PerkLib.MaraesGiftFertility ) ) {
				preg++;
			}
			if( CoC.player.findPerk( PerkLib.BroodMother ) ) {
				preg++;
			}
			if( CoC.player.findPerk( PerkLib.FerasBoonBreedingBitch ) ) {
				preg++;
			}
			if( CoC.player.findPerk( PerkLib.MagicalFertility ) ) {
				preg++;
			}
			if( CoC.player.findPerk( PerkLib.FerasBoonWideOpen ) || CoC.player.findPerk( PerkLib.FerasBoonMilkingTwat ) ) {
				preg++;
			}
			bodyStats += preg + '\n';
		}
		if( CoC.player.cocks.length > 0 ) {
			bodyStats += '<b>Total Cocks:</b> ' + CoC.player.cocks.length + '\n';
			var totalCockLength = 0;
			var totalCockGirth  = 0;
			_.forEach(CoC.player.cocks, function(cock) {
				totalCockLength += cock.cockLength;
				totalCockGirth += cock.cockThickness;
			});
			bodyStats += '<b>Total Cock Length:</b> ' + Math.round( totalCockLength ) + ' inches\n';
			bodyStats += '<b>Total Cock Girth:</b> ' + Math.round( totalCockGirth ) + ' inches\n';
		}
		if( CoC.player.vaginas.length > 0 ) {
			bodyStats += '<b>Vaginal Capacity:</b> ' + Math.round( CoC.player.vaginalCapacity() ) + '\n' + '<b>Vaginal Looseness:</b> ' + Math.round( CoC.player.looseness() ) + '\n';
		}
		if( CoC.player.findPerk( PerkLib.SpiderOvipositor ) || CoC.player.findPerk( PerkLib.BeeOvipositor ) ) {
			bodyStats += '<b>Ovipositor Total Egg Count: ' + CoC.player.eggs() + '\nOvipositor Fertilized Egg Count: ' + CoC.player.fertilizedEggs() + '</b>\n';
		}
		if( CoC.player.findStatusAffect( StatusAffects.SlimeCraving ) >= 0 ) {
			if( CoC.player.statusAffectv1( StatusAffects.SlimeCraving ) >= 18 ) {
				bodyStats += '<b>Slime Craving:</b> Active! You are currently losing strength and speed.  You should find fluids.\n';
			} else {
				if( CoC.player.findPerk( PerkLib.SlimeCore ) ) {
					bodyStats += '<b>Slime Stored:</b> ' + ((17 - CoC.player.statusAffectv1( StatusAffects.SlimeCraving )) * 2) + ' hours until you start losing strength.\n';
				} else {
					bodyStats += '<b>Slime Stored:</b> ' + (17 - CoC.player.statusAffectv1( StatusAffects.SlimeCraving )) + ' hours until you start losing strength.\n';
				}
			}
		}
		if( bodyStats !== '' ) {
			MainView.outputText( '\n<b><u>Body Stats</u></b>\n' + bodyStats, false );
		}
		// End Body Stats
		// Begin Misc Stats
		var miscStats = '';
		if( CoC.flags[ kFLAGS.EGGS_BOUGHT ] > 0 ) {
			miscStats += '<b>Eggs Traded For:</b> ' + CoC.flags[ kFLAGS.EGGS_BOUGHT ] + '\n';
		}
		if( CoC.flags[ kFLAGS.TIMES_AUTOFELLATIO_DUE_TO_CAT_FLEXABILITY ] > 0 ) {
			miscStats += '<b>Times Had Fun with Feline Flexibility:</b> ' + CoC.flags[ kFLAGS.TIMES_AUTOFELLATIO_DUE_TO_CAT_FLEXABILITY ] + '\n';
		}
		if( CoC.flags[ kFLAGS.FAP_ARENA_SESSIONS ] > 0 ) {
			miscStats += '<b>Times Circle Jerked in the Arena:</b> ' + CoC.flags[ kFLAGS.FAP_ARENA_SESSIONS ] + '\n<b>Victories in the Arena:</b> ' + CoC.flags[ kFLAGS.FAP_ARENA_VICTORIES ] + '\n';
		}
		if( CoC.flags[ kFLAGS.SPELLS_CAST ] > 0 ) {
			miscStats += '<b>Spells Cast:</b> ' + CoC.flags[ kFLAGS.SPELLS_CAST ] + '\n';
		}
		if( miscStats !== '' ) {
			MainView.outputText( '\n<b><u>Miscellaneous Stats</u></b>\n' + miscStats );
		}
		// End Misc Stats
		// Begin Addition Stats
		var addictStats = '';
		//Marble Milk Addition
		if( CoC.player.statusAffectv3( StatusAffects.Marble ) > 0 ) {
			addictStats += '<b>Marble Milk:</b> ';
			if( !CoC.player.findPerk( PerkLib.MarbleResistant ) && !CoC.player.findPerk( PerkLib.MarblesMilk ) ) {
				addictStats += Math.round( CoC.player.statusAffectv2( StatusAffects.Marble ) ) + '%\n';
			} else if( CoC.player.findPerk( PerkLib.MarbleResistant ) ) {
				addictStats += '0%\n';
			} else {
				addictStats += '100%\n';
			}
		}
		// Mino Cum Addiction
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00340 ] > 0 || CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] > 0 || CoC.player.findPerk( PerkLib.MinotaurCumAddict ) ) {
			if( !CoC.player.findPerk( PerkLib.MinotaurCumAddict ) ) {
				addictStats += '<b>Minotaur Cum:</b> ' + Math.round( CoC.flags[ kFLAGS.MINOTAUR_CUM_ADDICTION_TRACKER ] * 10 ) / 10 + '%\n';
			} else {
				addictStats += '<b>Minotaur Cum:</b> 100+%\n';
			}
		}
		if( addictStats !== '' ) {
			MainView.outputText( '\n<b><u>Addictions</u></b>\n' + addictStats, false );
		}
		// End Addition Stats
		// Begin Interpersonal Stats
		var interpersonStats = '';
		if( CoC.flags[ kFLAGS.ARIAN_PARK ] > 0 ) {
			interpersonStats += '<b>Arian\'s Health:</b> ' + Math.round( SceneLib.arianScene.arianHealth() ) + '\n';
		}
		if( CoC.flags[ kFLAGS.ARIAN_VIRGIN ] > 0 ) {
			interpersonStats += '<b>Arian Sex Counter:</b> ' + Math.round( CoC.flags[ kFLAGS.ARIAN_VIRGIN ] ) + '\n';
		}
		if( SceneLib.benoit.benoitAffection() > 0 ) {
			interpersonStats += '<b>' + SceneLib.benoit.benoitMF( 'Benoit', 'Benoite' ) + ' Affection:</b> ' + Math.round( SceneLib.benoit.benoitAffection() ) + '%\n';
		}
		if( CoC.flags[ kFLAGS.BROOKE_MET ] > 0 ) {
			interpersonStats += '<b>Brooke Affection:</b> ' + Math.round( SceneLib.brooke.brookeAffection() ) + '\n';
		}
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00218 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00219 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00220 ] > 0 ) {
			interpersonStats += '<b>Body Parts Taken By Ceraph:</b> ' + (CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00218 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00219 ] + CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00220 ]) + '\n';
		}
		if( SceneLib.emberScene.emberAffection() > 0 ) {
			interpersonStats += '<b>Ember Affection:</b> ' + Math.round( SceneLib.emberScene.emberAffection() ) + '%\n';
		}
		if( SceneLib.helFollower.helAffection() > 0 ) {
			interpersonStats += '<b>Helia Affection:</b> ' + Math.round( SceneLib.helFollower.helAffection() ) + '%\n';
		}
		if( SceneLib.helFollower.helAffection() >= 100 ) {
			interpersonStats += '<b>Helia Bonus Points:</b> ' + Math.round( CoC.flags[ kFLAGS.HEL_BONUS_POINTS ] ) + '\n';
		}
		if( CoC.flags[ kFLAGS.ISABELLA_AFFECTION ] > 0 ) {
			interpersonStats += '<b>Isabella Affection:</b> ';
			if( !SceneLib.isabellaFollowerScene.isabellaFollower() ) {
				interpersonStats += Math.round( CoC.flags[ kFLAGS.ISABELLA_AFFECTION ] ) + '%\n';
			} else {
				interpersonStats += '100%\n';
			}
		}
		if( CoC.flags[ kFLAGS.KATHERINE_UNLOCKED ] >= 4 ) {
			interpersonStats += '<b>Katherine Submissiveness:</b> ' + SceneLib.katherine.submissiveness() + '\n';
		}
		if( CoC.player.findStatusAffect( StatusAffects.Kelt ) >= 0 && CoC.flags[ kFLAGS.KELT_BREAK_LEVEL ] === 0 ) {
			if( CoC.player.statusAffectv2( StatusAffects.Kelt ) >= 130 ) {
				interpersonStats += '<b>Submissiveness To Kelt:</b> ' + 100 + '%\n';
			} else {
				interpersonStats += '<b>Submissiveness To Kelt:</b> ' + Math.round( CoC.player.statusAffectv2( StatusAffects.Kelt ) / 130 * 100 ) + '%\n';
			}
		}
		if( CoC.flags[ kFLAGS.ANEMONE_KID ] > 0 ) {
			interpersonStats += '<b>Kid A\'s Confidence:</b> ' + SceneLib.anemoneScene.kidAXP() + '%\n';
		}
		if( CoC.flags[ kFLAGS.KIHA_AFFECTION_LEVEL ] === 2 ) {
			if( SceneLib.kihaFollower.followerKiha() ) {
				interpersonStats += '<b>Kiha Affection:</b> ' + 100 + '%\n';
			} else {
				interpersonStats += '<b>Kiha Affection:</b> ' + Math.round( CoC.flags[ kFLAGS.KIHA_AFFECTION ] ) + '%\n';
			}
		}
		//Lottie stuff
		if( CoC.flags[ kFLAGS.UNKNOWN_FLAG_NUMBER_00281 ] > 0 ) {
			interpersonStats += '<b>Lottie\'s Encouragement:</b> ' + SceneLib.lottie.lottieMorale() + ' (higher is better)\n' + '<b>Lottie\'s Figure:</b> ' + SceneLib.lottie.lottieTone() + ' (higher is better)\n';
		}
		if( SceneLib.salon.lynnetteApproval() !== 0 ) {
			interpersonStats += '<b>Lynnette\'s Approval:</b> ' + SceneLib.salon.lynnetteApproval() + '\n';
		}
		if( CoC.flags[ kFLAGS.OWCAS_ATTITUDE ] > 0 ) {
			interpersonStats += '<b>Owca\'s Attitude:</b> ' + CoC.flags[ kFLAGS.OWCAS_ATTITUDE ] + '\n';
		}
		if( SceneLib.rubi.rubiAffection() > 0 ) {
			interpersonStats += '<b>Rubi\'s Affection:</b> ' + Math.round( SceneLib.rubi.rubiAffection() ) + '%\n' + '<b>Rubi\'s Orifice Capacity:</b> ' + Math.round( SceneLib.rubi.rubiCapacity() ) + '%\n';
		}
		if( CoC.flags[ kFLAGS.SHEILA_XP ] !== 0 ) {
			interpersonStats += '<b>Sheila\'s Corruption:</b> ' + SceneLib.sheilaScene.sheilaCorruption();
			if( SceneLib.sheilaScene.sheilaCorruption() > 100 ) {
				interpersonStats += ' (Yes, it can go above 100)';
			}
			interpersonStats += '\n';
		}
		if( CoC.flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ] !== 0 ) {
			if( SceneLib.urta.urtaLove() ) {
				interpersonStats += '<b>Urta Status:</b> Lover\n';
			} else if( CoC.flags[ kFLAGS.URTA_COMFORTABLE_WITH_OWN_BODY ] === -1 ) {
				interpersonStats += '<b>Urta Status:</b> Ashamed\n';
			} else if( CoC.flags[ kFLAGS.URTA_PC_AFFECTION_COUNTER ] < 30 ) {
				interpersonStats += '<b>Urta\'s Affection:</b> ' + Math.round( CoC.flags[ kFLAGS.URTA_PC_AFFECTION_COUNTER ] * 3.3333 ) + '%\n';
			} else {
				interpersonStats += '<b>Urta Status:</b> Ready To Confess Love\n';
			}
		}
		if( interpersonStats !== '' ) {
			MainView.outputText( '\n<b><u>Interpersonal Stats</u></b>\n' + interpersonStats, false );
		}
		// End Interpersonal Stats
		// Begin Ongoing Stat Effects
		var statEffects = '';
		if( CoC.player.inHeat ) {
			statEffects += 'Heat - ' + Math.round( CoC.player.statusAffectv3( StatusAffects.Heat ) ) + ' hours remaining\n';
		}
		if( CoC.player.inRut ) {
			statEffects += 'Rut - ' + Math.round( CoC.player.statusAffectv3( StatusAffects.Rut ) ) + ' hours remaining\n';
		}
		if( CoC.player.statusAffectv1( StatusAffects.Luststick ) > 0 ) {
			statEffects += 'Luststick - ' + Math.round( CoC.player.statusAffectv1( StatusAffects.Luststick ) ) + ' hours remaining\n';
		}
		if( CoC.player.statusAffectv1( StatusAffects.BlackCatBeer ) > 0 ) {
			statEffects += 'Black Cat Beer - ' + CoC.player.statusAffectv1( StatusAffects.BlackCatBeer ) + ' hours remaining (Lust resistance 20% lower, physical resistance 25% higher.)\n';
		}
		if( statEffects !== '' ) {
			MainView.outputText( '\n<b><u>Ongoing Status Effects</u></b>\n' + statEffects, false );
		}
		// End Ongoing Stat Effects
		EngineCore.doNext( MainView, MainView.playerMenu );
	};
	SceneLib.registerScene('statsScene', new StatsScene());
	MainView.setMenuButton( MainView.MENU_STATS, 'Stats', SceneLib.statsScene, SceneLib.statsScene.displayStats );
});