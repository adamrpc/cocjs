'use strict';

angular.module( 'cocjs' ).run( function( SceneLib, MainView, ImpGang, ImpLord, PerkLib, PregnancyStore, ImageManager, CockTypesEnum, Appearance, Combat, Descriptors, StatusAffects, AppearanceDefs, Utils, CoC, EngineCore ) {
	function ImpScene() {
	}

	ImpScene.prototype.impVictory = function() {
		EngineCore.clearOutput();
		var canFeed = (CoC.player.findStatusAffect( StatusAffects.Feeder ) >= 0);
		var canBikiniTits = (CoC.player.hasVagina() && CoC.player.biggestTitSize() >= 4 && CoC.player.armor.id === 'LMArmor');
		EngineCore.outputText( 'You smile in satisfaction as ' + CoC.monster.a + CoC.monster.short + ' collapses and begins masturbating feverishly.' );
		if( canFeed ) {
			if( CoC.player.lust >= 33 ) {
				EngineCore.outputText( '  Sadly you realize your own needs have not been met.  Of course you could always rape the poor thing, but it might be more fun to force it to guzzle your breast-milk.\n\nWhat do you do?' );
			} else {
				EngineCore.outputText( '  You\'re not really turned on enough to rape it, but it might be fun to force it to guzzle your breast-milk.\n\nDo you breastfeed it?' );
			}
		} else if( CoC.player.lust >= 33 || canBikiniTits || CoC.player.canOvipositBee() ) {
			EngineCore.outputText( '  Sadly you realize your own needs have not been met.  Of course you could always rape the poor thing...\n\nDo you rape him?' );
		} else {
			Combat.cleanupAfterCombat();
			return;
		}
		EngineCore.menu();
		if( CoC.player.lust > 33 ) {
			var maleRape = null;
			if( CoC.player.hasCock() ) {
				if( CoC.player.cockThatFits( CoC.monster.analCapacity() ) === -1 ) {
					EngineCore.outputText( '\n\n<b>You\'re too big to rape an imp with ' + CoC.player.oMultiCockDesc() + '.</b>' );
				} else {
					maleRape = (CoC.player.isTaur() ? this.centaurOnImpStart : this.rapeImpWithDick);
				}
			}
			if( CoC.player.hasVagina() ) {
				if( CoC.player.isTaur() ) {
					maleRape = this.centaurOnImpStart;
					EngineCore.addButton( 1, 'Group Vaginal', this.centaurGirlOnImps );
				} else {
					EngineCore.addButton( 1, 'Female Rape', this.rapeImpWithPussy );
				}
			} else if( maleRape === null && !CoC.player.hasFuckableNipples() && !canFeed && !canBikiniTits && !CoC.player.canOvipositBee() ) {
				Combat.cleanupAfterCombat(); //Only happens when there's no way to fuck the imp
				return;
			}
			EngineCore.addButton( 0, (CoC.player.isTaur() ? 'Centaur Rape' : 'Male Rape'), maleRape );
			if( CoC.player.hasFuckableNipples() ) {
				EngineCore.addButton( 2, 'NippleFuck', this.noogaisNippleRape );
			}
		}
		if( canFeed ) {
			EngineCore.addButton( 3, 'Breastfeed', this.areImpsLactoseIntolerant );
		}
		if( canBikiniTits ) {
			EngineCore.addButton( 4, 'B.Titfuck', CoC.player.armor.lustyMaidenPaizuri );
		}
		if( CoC.player.canOvipositBee() ) {
			EngineCore.addButton( 8, 'Oviposit', this.putBeeEggsInAnImpYouMonster );
		}
		EngineCore.addButton( 9, 'Leave', Combat.cleanupAfterCombat );
	};
	ImpScene.prototype.rapeImpWithDick = function() {
		var x = CoC.player.cockThatFits( CoC.monster.analCapacity() );
		if( x < 0 ) {
			x = 0;
		}
		//Single cock;
		EngineCore.outputText( ImageManager.showImage( 'imp-win-male-fuck' ), false );
		if( CoC.player.cocks.length === 1 ) {
			EngineCore.outputText( 'With a demonic smile you grab the insensible imp and lift him from the ground by his neck.  The reduced airflow doesn\'t seem to slow his feverish masturbation at all, and only serves to make him harder.', true );
			if( CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
				EngineCore.outputText( '  You casually unclasp your ' + CoC.player.armorName + ' and reveal your ' + Descriptors.cockDescript( x ) + ', ', false );
				if( CoC.player.breastRows.length > 0 && CoC.player.breastRows[ 0 ].breastRating > 2 ) {
					EngineCore.outputText( 'smashing him against your ' + Descriptors.breastDescript( 0 ) + ' while you jerk hard on your ' + Descriptors.cockDescript( x ) + ', bringing it to a full, throbbing erection.', false );
				} else {
					EngineCore.outputText( 'stroking it to full hardness languidly.', false );
				}
			}
			EngineCore.outputText( '\n\nWith no foreplay, you press your ' + Descriptors.cockDescript( x ) + ' against his tight little pucker and ram it in to the hilt.  The imp\'s eyes bulge in surprise even as a thick stream of pre leaks from his ' + CoC.monster.cockDescriptShort( 0 ) + '.  You grab him by his distended waist and brutally rape the little demon, whose claws stay busy adding to his pleasure.', false );
			if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.CAT ) {
				EngineCore.outputText( '  The tiny creature\'s claws dig into your sides at the feeling of soft, hooked barbs stroking his sensitive insides.', false );
			}
			if( CoC.player.cocks[ 0 ].cockLength >= 7 && CoC.player.cocks[ 0 ].cockLength <= 12 ) {
				EngineCore.outputText( '  Each thrust obviously distorts the imp\'s abdomen.  It amazes you that it doesn\'t seem to be hurting him.', false );
			}
			if( CoC.player.cocks[ 0 ].cockLength > 12 ) {
				EngineCore.outputText( '  Each plunge into the imp\'s tight asshole seems to distort its entire body, bulging obscenely from its belly and chest.  Amazingly he doesn\'t seem to mind, his efforts focused solely on his sorely throbbing demon-dick.', false );
			}
			EngineCore.outputText( '\n\nThe tight confines of the imp\'s ass prove too much for you, and you feel your orgasm build.', false );
			if( CoC.player.balls === 0 && CoC.player.vaginas.length > 0 ) {
				EngineCore.outputText( '  The cum seems to boil out from inside you as your ' + Descriptors.vaginaDescript( 0 ) + ' soaks itself.  With delicious slowness you fire rope after rope of cum deep into the imp\'s rectum.', false );
			}
			if( CoC.player.balls === 0 && CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( '  The cum seems to boil out from inside you, flowing up your ' + Descriptors.cockDescript( x ) + '.  With delicious slowness, you fire rope after rope of cum deep into the imp\'s rectum.', false );
			}
			if( CoC.player.cumQ() >= 14 && CoC.player.cumQ() <= 30 ) {
				EngineCore.outputText( '  Your orgasm drags on and on, until your slick jism is dripping out around your ' + Descriptors.cockDescript( x ) + '.', false );
			}
			if( CoC.player.cumQ() > 30 && CoC.player.cumQ() <= 100 ) {
				EngineCore.outputText( '  Your orgasm seems to last forever, jizz dripping out of the imp\'s asshole around your ' + Descriptors.cockDescript( x ) + ' as you plunder him relentlessly.', false );
			}
			if( CoC.player.cumQ() > 100 ) {
				EngineCore.outputText( '  Your orgasm only seems to grow more and more intense as it goes on, each spurt more powerful and copious than the last.  The imp begins to look slightly pregnant as you fill him, and tiny jets of cum squirt out around your ' + Descriptors.cockDescript( x ) + ' with each thrust.', false );
			}
			EngineCore.outputText( '\n\nSatisfied at last, you pull him off just as he reaches his own orgasm, splattering his hot demon-cum all over the ground.   You drop the imp hard and he passes out, dripping mixed fluids that seem to be absorbed by the dry earth as fast as they leak out.', false );
		}
		//Multicock;
		if( CoC.player.cocks.length >= 2 ) {
			EngineCore.outputText( 'With a demonic smile you grab the insensible imp and lift him from the ground by his neck.  The reduced airflow doesn\'t seem to slow his feverish masturbation at all, and only serves to make him harder.', true );
			if( CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
				EngineCore.outputText( '  You casually unclasp your ' + CoC.player.armorName + ' and reveal your ' + Descriptors.multiCockDescriptLight() + ', ', false );
				if( CoC.player.breastRows.length > 0 && CoC.player.breastRows[ 0 ].breastRating > 2 ) {
					EngineCore.outputText( 'smashing him against your ' + Descriptors.breastDescript( 0 ) + ' while you jerk hard on one of your ' + Descriptors.cockDescript( x ) + 's, bringing it to a full, throbbing erection.', false );
				} else {
					EngineCore.outputText( 'stroking one of your members to full hardness languidly.', false );
				}
			}
			EngineCore.outputText( '\n\nWith no foreplay, you press a ' + Descriptors.cockDescript( x ) + ' against his tight little pucker and ram it in to the hilt.  The imp\'s eyes bulge in surprise even as a thick stream of pre leaks from his ' + CoC.monster.cockDescriptShort( 0 ) + '.  You grab him by his distended waist and brutally rape the little demon, whose claws stay busy adding to his pleasure.', false );
			if( CoC.player.cocks[ 0 ].cockLength >= 7 && CoC.player.cocks[ 0 ].cockLength <= 12 ) {
				EngineCore.outputText( '  Each thrust obviously distorts the imp\'s abdomen.  It amazes you that it doesn\'t seem to be hurting him.', false );
			}
			if( CoC.player.cocks[ 0 ].cockLength > 12 && CoC.player.cocks[ 0 ].cockLength <= 18 ) {
				EngineCore.outputText( '  Each plunge into the imp\'s tight asshole seems to distort its entire body, bulging obscenely from its belly and chest.  Amazingly he doesn\'t seem to mind, his efforts focused solely on his sorely throbbing demon-dick.', false );
			}
			EngineCore.outputText( '\n\nThe tight confines of the imp\'s ass prove too much for you, and you feel your orgasm build.', false );
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( 'The cum seems to boil in your balls, sending heat spreading through your ' + Descriptors.cockDescript( x ) + ' as your muscles clench reflexively, propelling hot spurts of jism deep into the imp\'s rectum.  Your other equipment pulses and dripples steady streams of its own cum.', false );
			}
			if( CoC.player.balls === 0 && CoC.player.vaginas.length > 0 ) {
				EngineCore.outputText( 'The cum seems to boil out from inside you as your ' + Descriptors.vaginaDescript( 0 ) + ' soaks itself.  With delicious slowness you fire rope after rope of cum deep into the imp\'s rectum.  Your other equipment drizzles small streams of jizz in sympathy.', false );
			}
			if( CoC.player.balls === 0 && CoC.player.vaginas.length === 0 ) {
				EngineCore.outputText( 'The cum seems to boil out from inside you, flowing up your ' + Descriptors.cockDescript( x ) + '.  With delicious slowness, you fire rope after rope of cum deep into the imp\'s rectum.  Your other equipment drizzles small streams of jizz in sympathy.', false );
			}
			if( CoC.player.cumQ() >= 14 && CoC.player.cumQ() <= 30 ) {
				EngineCore.outputText( '  Your orgasm drags on and on, until your slick jism is dripping out around your ' + Descriptors.cockDescript( x ) + '.', false );
			}
			if( CoC.player.cumQ() > 30 && CoC.player.cumQ() <= 100 ) {
				EngineCore.outputText( '  Your orgasm seems to last forever, jizz dripping out of the imp\'s asshole around your ' + Descriptors.cockDescript( x ) + ' as you plunder him relentlessly.', false );
			}
			if( CoC.player.cumQ() > 100 ) {
				EngineCore.outputText( '  Your orgasm only seems to grow more and more intense as it goes on, each spurt more powerful and copious than the last.  The imp begins to look slightly pregnant as you fill him, and tiny jets of cum squirt out around your ' + Descriptors.cockDescript( x ) + ' with each thrust.', false );
			}
			EngineCore.outputText( '\n\nSatisfied at last, you pull him off just as he reaches his own orgasm, splattering his hot demon-cum all over the ground.   You drop the imp hard and he passes out, dripping mixed fluids that seem to be absorbed by the dry earth as fast as they leak out.', false );
		}
		CoC.player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		Combat.cleanupAfterCombat();
	};
	ImpScene.prototype.rapeImpWithPussy = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( ImageManager.showImage( 'imp-win-female-fuck' ), false );
		CoC.player.slimeFeed();
		EngineCore.outputText( 'You shed your ' + CoC.player.armorName + ' without a thought and approach the masturbating imp, looming over him menacingly.  Your ' + Descriptors.vaginaDescript( 0 ) + ' moistens in anticipation as you gaze down upon his splendid rod. With no hesitation, you lower yourself until your lips are spread wide by his demon-head, the hot pre-cum tingling deliciously.', false );
		//Too small!;
		if( CoC.player.vaginalCapacity() < CoC.monster.cockArea( 0 ) ) {
			EngineCore.outputText( '  You frown as you push against him, but his demonic tool is too large for your ' + Descriptors.vaginaDescript( 0 ) + '.  With a sigh, you shift position and begin grinding your ' + Descriptors.vaginaDescript( 0 ) + ' against his ' + CoC.monster.cockDescriptShort( 0 ) + ', coating it with fluids of your gender.  Your clit tingles wonderfully as it bumps against every vein on his thick appendage.', false );
			if( CoC.player.breastRows.length > 0 && CoC.player.breastRows[ 0 ].breastRating > 1 ) {
				EngineCore.outputText( '  You happily tug and pinch on your erect nipples, adding to your pleasure and nearly driving yourself to orgasm.', false );
			}
			EngineCore.outputText( '\n\nYou lose track of time as you languidly pump against the imp\'s ' + CoC.monster.cockDescriptShort( 0 ) + '.  At long last you feel your ' + Descriptors.vaginaDescript( 0 ) + ' ripple and quiver.  Your ' + CoC.player.legs() + ' give out as you lose your muscle control and collapse against the small demon.  You gasp as his ' + CoC.monster.cockDescriptShort( 0 ) + ' erupts against you, splattering your chest with hot demonic cum that rapidly soaks into your skin.  You giggle as you rise up from the exhausted imp, feeling totally satisfied.', false );
		}
		//Big enough!;
		else {
			EngineCore.outputText( '  You sink down his ' + CoC.monster.cockDescriptShort( 0 ) + ' slowly, delighting in the gradual penetration and the tingling feeling of his dripping hot pre-cum.  At last you bottom out on his balls.', false );
			CoC.player.cuntChange( CoC.monster.cockArea( 0 ), true );
			EngineCore.outputText( '  Your lust and desire spurs you into movement, driving you to bounce yourself up and down on the ' + CoC.monster.cockDescriptShort( 0 ) + '.  His exquisite member pushes you to the very height of pleasure, your ' + Descriptors.vaginaDescript( 0 ) + ' clenching tightly of its own accord each time you bottom out.  The tensing of the little demon\'s hips is the only warning you get before he cums inside you, hot demonic jizz pouring into your womb.  Your ' + CoC.player.legs() + ' give out, pushing him deeper as he finishes filling you.', false );
			EngineCore.outputText( '\n\nThe two of you lay there a moment while you recover, at last separating as you rise up off his ' + CoC.monster.cockDescriptShort( 0 ) + '.  Spunk drips down your legs, quickly wicking into your skin and disappearing.', false );
			//Taking it internal is more corruptive!;
			EngineCore.dynStats( 'cor', 1 );
			//Preggers chance!;
			CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP );
			CoC.player.cuntChange( CoC.monster.cockArea( 0 ), true, true, false );
		}
		CoC.player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		Combat.cleanupAfterCombat();
	};
	ImpScene.prototype.sprocketImp = function() {
		CoC.player.slimeFeed();
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You fall to your knees, lost in thoughts of what you want the imp to do to you.  Your body burns with desire, ready for the anal assault to come.  At least that\'s what you think.  You reach a hand out to the imp, wanting to pull him to you, to make him take you the way you need to be taken.  But he doesn\'t, not this time.\n\n', false );
		//New PG;
		EngineCore.outputText( 'Much to your surprise, the imp flutters upward on his small leathery wings and rushes toward you.  ', false );
		if( CoC.player.hairLength > 0 ) {
			EngineCore.outputText( 'His claws dig into your hair ', false );
		} else {
			EngineCore.outputText( 'His claws dig into your wrists ', false );
		}
		EngineCore.outputText( 'and you find yourself dragged upward with him, soaring over the tops of the trees.  The cool rush of air does nothing to abate your arousal.  If anything, the cold shock only makes your body more aware of its own need.  After just a few seconds that feel like an eternity to your lust-filled being, the imp hurls you down into a tree.  You flail as you fall, barely catching yourself on the upper branches.  Your hands and ' + CoC.player.legs() + ' are tangled in the smooth wooden spiderweb below you, your mind torn between desire for the imp above and fear of the fall below.  You can see from the gleam in the horned creature\'s red eyes that he has you right where he wants you.\n\n', false );
		//New PG;
		EngineCore.outputText( 'The imp pulls the loincloth from his waist, revealing his red throbbing cock.  It is certainly large, even though it stands smaller than your own erection.  He tosses the cloth aside, and you see him fluttering down toward you just before the rough fabric lands on your face.  His clawed fingers grasp ', false );
		//Variable cocktext;
		if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.HUMAN || CoC.player.cocks[ 0 ].cockType === CockTypesEnum.DEMON || CoC.player.cocks[ 0 ].cockType.Index > 4 ) {
			EngineCore.outputText( 'your ' + Descriptors.cockDescript( 0 ) + ', rubbing the tip of his prick against your own, ', false );
		} else if( CoC.player.hasKnot( 0 ) ) {
			EngineCore.outputText( 'your ' + Descriptors.cockDescript( 0 ) + ', rubbing the tip of his prick against your point, ', false );
		} else if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.HORSE ) {
			EngineCore.outputText( 'your ' + Descriptors.cockDescript( 0 ) + ', rubbing the tip of his prick against your flared head, ', false );
		} else if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.TENTACLE ) {
			EngineCore.outputText( 'your huge green dick, rubbing the tip of his prick against your purplish cock-head, ', false );
		}
		EngineCore.outputText( 'smearing your pre-cum together.  You wonder if he is planning on just jerking both of you off as you shake the cloth from your face.  He flashes you an evil smile, making your eyes widen in terror as you realize what he is planning. Before you can even think to make a move to stop him, the imp ', false );
		if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.HUMAN || CoC.player.cocks[ 0 ].cockType === CockTypesEnum.DEMON || CoC.player.cocks[ 0 ].cockType.Index > 4 ) {
			EngineCore.outputText( 'shoves his shaft deeply into the slit in the head of your dick.  ', false );
		} else if( CoC.player.hasKnot( 0 ) ) {
			EngineCore.outputText( 'finds the hole in the pointed head of your cock and plunges his shaft deeply into it, literally fucking your urethra.  ', false );
		} else if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.HORSE ) {
			EngineCore.outputText( 'seats his dick in the flared head of your prick, and then pushes farther. His shaft plunges into yours, filling your cock more than any cum load ever could.  ', false );
		} else if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.TENTACLE ) {
			EngineCore.outputText( 'shoves his dick deeply into the slit in the head of your vine-like cock.  ', false );
		}
		//New PG;
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'He grips your cock tightly as he fucks you, treating you like a ', false );
		//Differing cocksleeve texts;
		if( CoC.player.skinDesc === 'fur' ) {
			EngineCore.outputText( 'furry cock-sleeve', false );
		} else {
			if( CoC.player.skinTone === 'purple' || CoC.player.skinTone === 'blue' || CoC.player.skinTone === 'shiny black' ) {
				EngineCore.outputText( 'demonic cock-sleeve', false );
			} else {
				EngineCore.outputText( 'human cock-sleeve', false );
			}
		}
		//Bonus boob shake or period if no boobs.;
		if( CoC.player.breastRows.length > 0 && CoC.player.biggestTitSize() > 2 ) {
			EngineCore.outputText( ', fucking you so hard that your ' + CoC.player.allBreastsDescript() + ' bounce with each thrust.  ', false );
		} else {
			EngineCore.outputText( '.  ', false );
		}
		EngineCore.outputText( 'It briefly crosses your mind that this should be painful, but something about either his lubrication or yours makes it comfortable enough to have you writhing in pleasure.  ', false );
		EngineCore.outputText( 'He thrusts roughly into you for several minutes, your hips bucking upward to meet him, ', false );
		if( CoC.player.cocks.length === 2 ) {
			EngineCore.outputText( 'your other cock finding pleasure in rubbing against his body ', false );
		}
		if( CoC.player.cocks.length > 2 ) {
			EngineCore.outputText( 'your other cocks finding pleasure in rubbing against his body ', false );
		}
		//Cum;
		EngineCore.outputText( 'while copious amounts of sweat runs off of both your exposed forms, before he shivers and sinks deeply into you.  He cums hard, the heat of his demon seed burning your loins. His orgasm lasts longer than you think possible, forcing your own climax. Your seed mixes within your body, becoming more than you can handle and spilling out from your urethra around his intruding member.  ', false );
		//Extra cum-texts;
		if( CoC.player.cocks.length === 2 ) {
			EngineCore.outputText( 'Your other cock cums at the same time, liberally splattering your spunk up his back.  ', false );
		}
		if( CoC.player.cocks.length > 2 ) {
			EngineCore.outputText( 'The rest of your ' + Descriptors.multiCockDescriptLight() + ' twitch and release their seed at the same time, creating a shower of spunk that rains down on both you and the imp, coating both of your bodies.  ', false );
		}
		if( CoC.player.biggestLactation() >= 1 ) {
			EngineCore.outputText( 'At the same time, milk bursts from your ' + Descriptors.nippleDescript( 0 ) + 's, splattering him in the face.  You feel a sick sort of triumph as you get him back for cumming inside you.  ', false );
		}
		//Vagoooz;
		if( CoC.player.vaginas.length > 0 ) {
			EngineCore.outputText( 'Your pussy quivers, contracting furiously as your orgasm hits you - like it\'s trying to milk a phantom dick dry.  ', false );
		}
		//new PG;
		EngineCore.outputText( 'Satisfied, his dick slides from you and he flies away as mixed seed continues to spill from your abused body. Your limbs grow weak, and you fall from the tree with a hard thud before losing consciousness.  ', false );
		//Take some damage;
		MainView.statsView.showStatDown( 'hp' );
		// hpDown.visible = true;;
		CoC.player.HP -= 10;
		if( CoC.player.HP < 1 ) {
			CoC.player.HP = 1;
		}
		Combat.cleanupAfterCombat();
	};
	ImpScene.prototype.centaurGirlOnImps = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You stand over the thoroughly defeated demon and get an amusing idea. The tiny creatures are far from a threat, but their features seem like they might be useful. You pick the imp up and place him in a tree with explicit orders to him to stay, much to his confusion. Once you\'re sure he won\'t move, you wolf whistle and wait.\n\n', false );
		EngineCore.outputText( 'A goblin appears from the underbrush behind you, but a swift kick sends her flying; she\'s not what you\'re after. You\'re soon rewarded with a trio of imps, who fly up to you, cocks at the ready.  Grabbing the defeated imp by the head, you explain your need to the group and waft a bit of your scent over to them with your tail. They confer among themselves only briefly, clear on the decision, as you toss their weaker fellow underneath them. The larger of the three, evidently the leader, smiles lewdly at you and agrees to your \'demands\'.\n\n', false );
		//[Female:;
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'The imps approach you, their various genitalia glistening in the sun and drawing your attention. Their cocks swing lewdly with every flap of their wings, but you turn around, wanting their ministrations to be a surprise.\n\n', false );
			EngineCore.outputText( 'Hands slide over you, stroking and patting your equine form. The roving fingers find their way to your rear quickly, and begin teasing around your ' + Descriptors.vaginaDescript() + ' and ' + Descriptors.assholeDescript() + '. They probe around but don\'t penetrate and you stamp your hoof in frustration. There\'s a chuckle from behind you and all but a handful of the hands disappear.\n\n', false );
			EngineCore.outputText( 'A slightly larger hand smacks your ' + Descriptors.assDescript() + ' then slides up and pops a thick finger inside. Your ' + Descriptors.assholeDescript() + ' tries to suck it in deeper, but loses the opportunity as it\'s extracted before doing anything. Instead, the hand returns to your flank and slides slowly forward to your torso.\n\n', false );
			EngineCore.outputText( 'The \'head\' imp comes around into your vision, hovering in front of you and letting you get a good look at his long member. He pulls on it, extracting a large bead of pre onto his other hand. Opening your mouth, he wipes the salty substance onto your tongue. You swallow it happily and feel your mouth watering and your ' + Descriptors.vaginaDescript() + ' pumping out fluid.\n\n', false );
			EngineCore.outputText( 'The leader looks past you and gives a signal to someone you can\'t see, but you don\'t have time to turn as a huge dog cock is slipped into your slavering cunt and an even larger spined prick is inserted into your ' + Descriptors.assholeDescript() + '. They begin pumping into you hard, and you whinny in satisfaction while the demon before you watches, jerking on himself.', false );
			CoC.player.cuntChange( CoC.monster.cockArea( 0 ), true, true, false );
			CoC.player.buttChange( CoC.monster.cockArea( 0 ), true, true, false );
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'He disappears behind you and gives you a slap on the haunches, yelling, "<i>Giddyup!</i>" and laughing heartily. Whether he expected you to or not, you decide to go for it and push off the ground with your forelegs, kicking them about in the air and feeling the demons aboard you scrabble to stay attached, before setting off at as fast a run as you can. You tear about in the dirt, clumps of mud and weeds flung behind you.\n\n', false );
			EngineCore.outputText( 'At the edge of the clearing is the leader, laughing as he watches you and still jerking himself. As if realizing that there\'s a better option available, he grabs the defeated imp and inserts himself into him, using him like a living cock sleeve who appears to not mind the position and cries out repeatedly as his ass is abused.\n\n', false );
			EngineCore.outputText( 'Your unexpected running momentarily paused the cocks inside you as their owners groped for holds on your ' + Descriptors.hipDescript() + ' and ' + Descriptors.assDescript() + '. With their positions relatively well established, they begin pounding at you again, causing you to nearly stumble in pleasure.\n\n', false );
			EngineCore.outputText( 'Managing to steady yourself, you run faster, feeling the frenetic cocks inside you explode. The hot spunk sprays about inside and you scream in ecstasy.', false );
			//[Has breasts: ;
			if( CoC.player.biggestTitSize() > 1 ) {
				EngineCore.outputText( '  Your hands reflexively grab your ' + Descriptors.chestDesc() + ' and mash them about.', false );
			}
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'The owner of the dog-cock in your ' + Descriptors.vaginaDescript() + ' manages to insert his knot as his balls empty inside you, but the cat-cock\'s body has no such luck and his grip on you falters. He slides out of your ' + Descriptors.assholeDescript() + ' but manages to grasp the fur of your back and straddle you, all while his cock continues to spray you down with jism.\n\n', false );
			//[Has breasts: ;
			if( CoC.player.biggestTitSize() > 1 ) {
				EngineCore.outputText( 'He slides up to your torso and grasps your wildly flailing ' + CoC.player.allBreastsDescript() + ', massaging them harshly. His ministrations are surprisingly crude, and you wonder how many times he\'s attempted to pleasure a woman.', false );
				//[Has fuckable nipples: ;
				if( CoC.player.hasFuckableNipples() ) {
					EngineCore.outputText( '  His fingers slide inside your ' + Descriptors.nippleDescript( 0 ) + 's and start spreading and squishing them. Your femcum leaks out over his hands and soon your front is slick and shiny.', false );
				}//All other nipples: ;
				else {
					EngineCore.outputText( '  His fingers grope and grab at your nipples, stretching them uncomfortably. Before you can complain he seems to realize his mistake and releases them.', false );
				}
				//[Is lactating normally: ;
				if( CoC.player.biggestLactation() >= 1 && CoC.player.lactationQ() < 50 ) {
					EngineCore.outputText( '  Milk dribbles and squirts from you as his desperate squishing continues, forming small puddles on the ground.', false );
				} else if( CoC.player.biggestLactation() >= 1 ) {
					EngineCore.outputText( '  Milk sprays from you as his desperate squishing continues, creating massive puddles of milk that you splash through as you continue moving.', false );
				}
				EngineCore.outputText( '\n\n', false );
			}
			EngineCore.outputText( 'You stop running, spraying dirt in a massive fan and sending the imp on your back flying into a tree, where he crumples to the ground unceremoniously. The doggy-dicked imp collapses out of you and is sprayed down with your orgasm, coating him in femcum and his own semen.\n\n', false );
			EngineCore.outputText( 'You trot over to the leader, still using the nearly unconscious imp as a cock sleeve, and pull the abused creature off of him. He looks shocked as you grab his cock and squeeze his balls, causing him to orgasm hard and spray you down in white hot seed. He collapses onto the ground, spent, as you wipe yourself down as best you can.', false );
			EngineCore.outputText( '  Collecting your things, you give the assorted bodies one last look and stumble back to camp.', false );
			CoC.player.orgasm();
			EngineCore.dynStats( 'cor', 1 );
		}
		Combat.cleanupAfterCombat();
	};
	ImpScene.prototype.centaurOnImpStart = function() {
		EngineCore.outputText( '', true );
		//Event: Centaur-Imp: Player Raping;
		EngineCore.outputText( 'As the imp collapses in front of you, ', false );
		if( CoC.monster.HP === 0 ) {
			EngineCore.outputText( 'panting in exhaustion', false );
		} else {
			EngineCore.outputText( 'masturbating furiously', false );
		}
		EngineCore.outputText( ', you advance toward the poor creature.  The demon\'s eyes run over your powerful equine muscles as you tower above it.  It is difficult to hide your smile as you look at the tiny creature\'s engorged cock and the perpetual lust filling its beady eyes.', false );
		//OPTIONAL THOUGHTS;
		//[if previously gave birth to imps and Cor >50] A part of you wonders idly if this is one the offspring that you added to this world ;
		//[corruption is under 80] but the you quickly banish the thought. [corruption is over 80]  and the thought fills you with excitement. ))  ;
		//<< Cor <50 >> ;
		if( CoC.player.cor < 50 ) {
			EngineCore.outputText( '  You lick your lips slightly as you begin to approach the small figure.', false );
		} else {
			EngineCore.outputText( 'You lick your lips obscenely as you approach the small figure.\n\n', false );
		}
		//[Even chance of any of the following happening if the player has the correct equipment, distribute chances between what equipment is available];
		var x = CoC.player.cockThatFits( CoC.monster.analCapacity() );
		if( x >= 0 && !CoC.player.hasVagina() ) {
			this.centaurOnImpMale();
		} else if( CoC.player.hasVagina() && x < 0 ) {
			this.centaurOnImpFemale();
		} else {
			EngineCore.outputText( 'Do you focus on your maleness or girl-parts?', false );
			EngineCore.choices( 'Male', EngineCore.createCallBackFunction( this.centaurOnImpMale, true ), 'Female', EngineCore.createCallBackFunction( this.centaurOnImpFemale, true ), '', null, '', null, '', null );
		}
	};
	//Player has a cock}};
	ImpScene.prototype.centaurOnImpMale = function( vape ) {
		var x = CoC.player.cockThatFits( CoC.monster.analCapacity() );
		if( x < 0 ) {
			x = 0;
		}
		if( vape ) {
			EngineCore.outputText( '', true );
		}
		EngineCore.outputText( 'As your shadow falls over the imp, it looks between your ' + CoC.player.legs() + ' with a hint of fear.  ', false );
		if( CoC.player.cockArea( x ) <= 15 ) {
			EngineCore.outputText( 'Relief washes over it followed by intense lust as is throws itself onto a mossy rock and eagerly presents its ' + Appearance.assholeDescript(CoC.monster) + '.   The sound of your hooves moving on either side of its body seems to send the creature into a frenzy as it begins humping the air while small mewling sounds escape its lips.  ', false );
			//<<Cor <50>> ;
			if( CoC.player.cor < 50 ) {
				EngineCore.outputText( 'You slowly rub your ' + Descriptors.cockDescript( x ) + ' between the creature\'s cheeks, letting your pre-cum oil the small hole, before slowly beginning the insertion.  Before you can get half-way the creatures drives its self back against you, impaling its ' + Appearance.assholeDescript(CoC.monster) + ' around your ' + Descriptors.cockDescript( x ) + ' and making inhuman sounds of ecstasy. The ' + Appearance.assholeDescript(CoC.monster) + ' relaxes around your ' + Descriptors.cockDescript( x ) + ', taking it all in while its practiced muscles grip and jerk you off internally.\n\n', false );
			}
			//<<Cor 50+>> ;
			else {
				EngineCore.outputText( 'You position your ' + Descriptors.cockDescript( x ) + ' against its dry anus and drive yourself inside of it using your powerful equine legs.  The creatures gives a loud shriek as its insides are forced open, and you feel the raw tightness trying to resist your intrusion.  Giving the creature no chance to relax you begin pistoning into it, grinning as the sounds of pain give way to grunts and yelps of pleasure. You cannot last long in the creature\'s hole, and soon spurts of cum begin shooting out and filling its bowels.\n\n', false );
			}
			//<<GoTo I1>>;
			this.centaurOnImpResults( 1 );
			//<<End>>;
			CoC.player.orgasm();
			Combat.cleanupAfterCombat();
			return;
		} else {
			//<<Cock: large, Cor <50>>;
			if( CoC.player.cor < 50 ) {
				EngineCore.outputText( 'The imp\'s eyes widen and you see its apprehension as it attempts to turn and flee.  You make soothing sounds as you approach the skittish creature, while easily keeping pace with it.  Seeing little chance for escape, the creature turns toward you again and carefully begins making its way between your ' + CoC.player.legs() + ', eyes wide in supplication.  Your smile seems to relax it, and lust fills its eyes again as it slowly starts massaging your ' + Descriptors.cockDescript( x ) + '.  Getting more and more confident, the creature is soon using both of its hands on your ' + Descriptors.cockDescript( x ) + ', and its wet and serpentine tongue is moving all over the length of your erection.  There is little chance of your ' + Descriptors.cockDescript( x ) + ' fitting into its small mouth, but it does its best to pleasure you as it goes more and more wild.  ', false );
				//<<Thick large>>;
				if( CoC.player.cocks[ 0 ].cockThickness > 3 ) {
					EngineCore.outputText( 'It is not long before you feel its tongue slipping into your urethra, and cum rushes from your ', false );
					if( CoC.player.balls > 0 ) {
						EngineCore.outputText( Descriptors.ballsDescriptLight(), false );
					} else {
						EngineCore.outputText( 'prostate', false );
					}
					EngineCore.outputText( ' as you feel the foreign invader wiggling inside.  ', false );
					//<</Thick>>  ;
				}
				EngineCore.outputText( 'You cannot take the attention for long before your hooves are scraping at the ground and jets of sperm shoot out of your ' + Descriptors.cockDescript( x ) + ' and down its waiting throat.\n\n', false );
				//<<GoTo I2>>;
				this.centaurOnImpResults( 2 );
				//<<End>>;
				CoC.player.orgasm();
				Combat.cleanupAfterCombat();
				return;
			}
			//<<Cock: large, Cor 50+>>;
			else {
				EngineCore.outputText( 'The imp\'s eyes widen and you see apprehension as it tries to turn around and get away.  It does not make it far before you run it down, knocking it over with your muscled flank.  Before it can try to run again you pin it down and position your ' + Descriptors.cockDescript( x ) + ' against its ' + Appearance.assholeDescript(CoC.monster) + '.  It feels far too small to handle your girth but a push of your powerful legs gets you in with the first inches.  The imp squeals out in pain and you wince slightly in the vice-like grip.  Gritting your teeth you push in the remaining length, the sounds of pain only serving to drive you forward all the harder.  Soon your ' + Descriptors.cockDescript( x ) + ' is moving in and out with more ease, though the imp\'s tender asshole is distending abnormally to accommodate the invading member.  As much as you long to extend your pleasure, the sensation and the unnatural sounds of the penetration prove too much for you to last long.\n\n', false );
				//<<GoTo I1>>;
				this.centaurOnImpResults( 1 );
				//<<End>>;
				CoC.player.orgasm();
				Combat.cleanupAfterCombat();
				return;
			}
		}
		//Tentacledicks!;
		//{{Player has 1+ very long (smallest 2+ feet) tentacle cocks}};
		if( CoC.player.cockTotal() > 1 && CoC.player.cocks[ CoC.player.biggestCockIndex() ].cockLength >= 24 ) {
			EngineCore.outputText( 'As your shadow falls over it, it looks with a hint of fear between your legs, and then its eyes widen in a mixture of apprehension and lust.  Before you can even more the little creatures scrambles forward between your hooves and wraps its hands around your ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + '.  Its tongue begins to trail all along the length of it as its small hands stroke it intensely.\n\n', false );
			//<< Cor <50>>;
			if( CoC.player.cor < 50 ) {
				EngineCore.outputText( 'You slowly undulate your ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + ' against the creature\'s mouth, delighting in its eager tongue.  ', false );
				//<<GoTo I3 then return>> ;
				this.centaurOnImpResults( 3 );
				EngineCore.outputText( 'The sounds beneath you quickly take on a more intense note and you feel massive amounts of cum splashing liberally over your hooves, belly, and ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + '.  The hot sensation sends you over the edge as you begin spilling yourself into the creature\'s eager mouth.\n\n', false );
				//<<GoTo I2>>;
				this.centaurOnImpResults( 2 );
				//<<End>>;
				CoC.player.orgasm();
				Combat.cleanupAfterCombat();
				return;
			}
			//<< 1 or 2 cocks, Cor 50+>>;
			else if( CoC.player.cockTotal() === 2 ) {
				EngineCore.outputText( 'With an evil smile you wait for your ' + Descriptors.cockDescript( CoC.player.smallestCockIndex() ) + ' to be at its lips before you slide it forward into its waiting mouth.  Giving it little more than a moment to catch its breath you slide your ' + Descriptors.cockDescript( CoC.player.smallestCockIndex() ) + ' further and down the creature\'s throat.  Though you cannot see the obscene bulge it is making in the creature\'s mouth-pussy you delight in the intense tightness beneath you.  The throat muscles are massaging your ' + Descriptors.cockDescript( CoC.player.smallestCockIndex() ) + ' as the imp desperately scrambles for air, pulling at the tentacles you have forced into it.  It cannot even begin to close its jaw as you thrust deeper and deeper, as you try to intensify the sensations.\n\n', false );
				EngineCore.outputText( 'As the imp is focused on the tentacles cutting off its air, you position your ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + ' against its ' + Appearance.assholeDescript(CoC.monster) + '.  Pausing only for a second for the pleasure of anticipation, you shove yourself deep inside the imp\'s ' + Appearance.assholeDescript(CoC.monster) + ', only making it a few inches before having to pull back and try again.  The creature\'s throat seems to be working overtime now as it tries to divide its attention between the two invaders.  Each thrust of your ' + Descriptors.cockDescript( CoC.player.smallestCockIndex() ) + ' makes it a little bit deeper inside of the creature, and you wonder passionately if you can get the two to meet in the middle.\n\n', false );
				EngineCore.outputText( 'It is not long before you begin to feel the creature\'s struggles slowing down.  ', false );
				//<<Cor <80 >> ;
				if( CoC.player.cor < 80 ) {
					EngineCore.outputText( 'Feeling merciful you extract yourself from the creature, flipping it unto a nearby rock as it begins to regain consciousness.  Before it realizes what you are doing your ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + ' is prodding at its ' + Appearance.assholeDescript(CoC.monster) + ', then sliding quickly between its cheeks.  The amount of slobber over you is more than enough lubricant.  You groan in pleasure as it gives a slight squeal, then proceed to finish yourself off in the once-tight orifice.\n\n', false );
					//<<Goto I1>> ;
					this.centaurOnImpResults( 1 );
					CoC.player.orgasm();
					Combat.cleanupAfterCombat();
					return;
				}
				//<<Cor 80+>> ;
				else {
					EngineCore.outputText( 'You groan in pleasure and slide your ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + ' even deeper down the creature\'s throat, until you can feel its head against your ', false );
					//<<if balls>>;
					if( CoC.player.balls > 0 ) {
						EngineCore.outputText( Descriptors.ballsDescriptLight() + '.\n\n', false );
					} else {
						EngineCore.outputText( 'groin.\n\n', false );
					}
					//<<GoTo I3 then return>> ;
					this.centaurOnImpResults( 3 );
					EngineCore.outputText( 'A guttural moan escapes your mouth as you realize the creature has completely passed out underneath you.  ', false );
					if( CoC.player.hasFuckableNipples() ) {
						EngineCore.outputText( 'Shoving your fingers deep into your ' + Descriptors.nippleDescript( 0 ) + 's', false );
					} else {
						EngineCore.outputText( 'With a fierce tug on your ' + Descriptors.nippleDescript( 0 ) + 's', false );
					}
					EngineCore.outputText( 'you begin to cum deep and directly into the imp\'s stomach and ' + Appearance.assholeDescript(CoC.monster) + '.  ', false );
					//<<cum multiplier: lots>>;
					if( CoC.player.cumQ() > 250 ) {
						EngineCore.outputText( 'Beneath you the creature\'s belly is distending more and more, and you can feel some of the overflowing cum filling back out until it is pouring out of the creature\'s unconscious mouth and overstretched ass, forming a spermy pool beneath it.', false );
					}
					EngineCore.outputText( 'With on last grunt you begin extracting the tentacles back out, almost cumming again from the tightness around them.  You give your ' + Descriptors.cockDescript( CoC.player.smallestCockIndex() ) + ' one last shake over the creature\'s face before trotting away satisfied and already thinking about the next creature you might abuse.', false );
					CoC.player.orgasm();
					Combat.cleanupAfterCombat();
					return;
				}
			}
			//<< 3+ cocks, Cor 80+>>;
			else {
				EngineCore.outputText( 'With an evil smile you wait for the creature\'s mouth to touch one of your tentacles before the other two snake their way down and wrap themselves around the imp\'s thighs.  With a tug the creatures is pulled off of it\'s feet and upside down, its eyes widening in a mixture of fear and debased lust as it sees your ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + ' undulating in front of it.  You slowly move the tentacle up as your other cocks forcefully tug its legs apart, and then playfully begin sliding yourself over the imp\'s small cheeks.\n\n', false );
				//<<Cor 80+, has given birth to an imp>>Part of you wonders idly if this is one of the creatures that you spawned, and that left its spermy surprise on you after it came out of the womb<</Cor>>  ;
				EngineCore.outputText( 'Licking your lips in anticipation you begin pushing your ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + ' into the imp\'s ' + Appearance.assholeDescript(CoC.monster) + ' while listening to the mewling sounds coming from beneath you.  You take your time as you push in, seeing no need to rush yourself as you feel the creature gaping more and more.  Once you bottom out you reach down and grab the creature\'s arms, securing it firmly against your belly as you break into a trot.  The sensation of the imp\'s ' + Appearance.assholeDescript(CoC.monster) + ' bouncing around your ' + Descriptors.cockDescript( CoC.player.biggestCockIndex() ) + ' is intense and you ride harder until you know you are close to the bring.  Quickly you slow down and drape the creature over a nearby boulder, using your hands and tentacles to pin it to the harsh surface, and then your mighty legs push you forward even deeper into the creature\'s bowels.  The shriek should be audible pretty far in this area, and you groan in debased pleasure thinking it might draw someone else for you to rape or be raped by.  Grunting slightly you begin pushing into the imp even harder just to generate more loud sex-noise.  ', false );
				//<<Breasts>>;
				if( CoC.player.biggestTitSize() >= 0 ) {
					EngineCore.outputText( 'One of your hands releases it and begins playing with your ' + CoC.player.allBreastsDescript(), false );
					//<<nips have pussies>> ;
					if( CoC.player.hasFuckableNipples() ) {
						EngineCore.outputText( ' and fingering your ' + Descriptors.nippleDescript( 0 ) + 's', false );
					}
					EngineCore.outputText( ' as you drool slightly in absolute pleasure.  ', false );
				}
				EngineCore.outputText( 'When the creature\'s noises lessen and all you can hear is the sloppy sounds of its ass being fucked you push yourself in a single mighty heave, grinding the creature into the rock and eliciting one last scream that pushes you over.\n\n', false );
				//<<GoTo I1>>;
				this.centaurOnImpResults( 1 );
				//<<End>>;
				CoC.player.orgasm();
				Combat.cleanupAfterCombat();
				return;
			}
		}
		CoC.player.orgasm();
		Combat.cleanupAfterCombat();
	};
	//CUNTS;
	ImpScene.prototype.centaurOnImpFemale = function( vape ) {
		if( vape ) {
			EngineCore.outputText( '', true );
		}
		//PREGGERS CHANCE HERE - unfinished;
		//{{Player has a cunt}};
		CoC.player.slimeFeed();
		CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP );
		EngineCore.outputText( 'As the imp lays beaten its hands stroke its ' + CoC.monster.cockDescriptShort( 0 ) + ' as its eyes look over you in the hope that you might abuse it in some manner.  You lick your lips as you stare at the large member and you turn around to display your ' + Descriptors.vaginaDescript( 0 ) + '.  ', false );
		//Not gaping?;
		if( CoC.player.vaginas[ 0 ].vaginalLooseness <= AppearanceDefs.VAGINA_LOOSENESS_GAPING ) {
			//Penetration for non-gape cases;
			EngineCore.outputText( 'With a lascivious grin the imp hops forward, gripping your flanks as it drives its member forward into your ' + Descriptors.vaginaDescript( 0 ) + '.  ', false );
			//<<If Pussy Virgin>> ;
			if( CoC.player.vaginas[ 0 ].virgin ) {
				EngineCore.outputText( 'You cry out as your virginal pussy is torn open by the massive member and the creature cries out in pleasure as it realizes what it has taken from you.  ', false );
				//[Lose Virginity] <</Virgin>>;
			}
			//Not virgin fucking flavors;
			else {
				if( CoC.player.vaginalCapacity() < CoC.monster.cockArea( 0 ) ) {
					EngineCore.outputText( 'It groans in delight at your incredible tightness and shoves itself forward even harder.  ', false );
				}
				//[Increase size as needed] ;
				//<<At Dicksize>>;
				if( CoC.player.vaginalCapacity() >= CoC.monster.cockArea( 0 ) && CoC.player.vaginalCapacity() <= CoC.monster.cockArea( 0 ) * 1.25 ) {
					EngineCore.outputText( 'It makes a pleased sound as it slides deeply into your ' + Descriptors.vaginaDescript( 0 ) + '.  ', false );
				}
				//<<Bigger than dicksize>> ;
				if( CoC.player.vaginalCapacity() >= CoC.monster.cockArea( 0 ) * 1.25 ) {
					EngineCore.outputText( 'Its dick slides easily and slopping noises start sounding from your backside.  Part of you wishes that its large member was larger still, as your mind drifts to some of the monstrous cocks that have penetrated you in the past.  ', false );
				}
			}
			//Ride around with him till he cums and falls off;
			EngineCore.outputText( 'When the creature completely bottoms out inside of you, you begin trotting forward with a wicked grin.  The creature\'s hands grasp your flanks desperately, and its ' + CoC.monster.cockDescriptShort( 0 ) + ' bounces inside your ' + Descriptors.vaginaDescript( 0 ) + ', adding to your sensation.  The movement is causing the imp to push himself even harder against you as it tries to not fall off, and it is all you can do to keep an eye on where you are going.  Soon you can feel the imp\'s sperm filling your ' + Descriptors.vaginaDescript( 0 ) + ' and overflowing even as your cunt-muscles try to milk it of all of its seed. Unsatisfied you begin to speed up as you use its ' + CoC.monster.cockDescriptShort( 0 ) + ' to bring about your own orgasm.  The small creature is unable to let go without hurting itself.  It hangs on desperately while you increase the pace and begin making short jumps to force it deeper into you.  The feeling of sperm dripping out and over your ' + Descriptors.clitDescript() + ' pushes you over and cry out in intense pleasure.  When you finally slow down and clear your head the imp is nowhere to be seen.  Trotting back along the trail of sperm you left behind you find only its small satchel.', false );
			CoC.player.cuntChange( CoC.monster.cockArea( 0 ), true, true, false );
			CoC.player.orgasm();
			Combat.cleanupAfterCombat();
			return;
			//END OF NON GAPE CASE;
		}
		//<<Gaping>>;
		else {
			EngineCore.outputText( 'With a lascivious grin the imp hops forward, gripping your flanks as it drives its member forward into your ' + Descriptors.vaginaDescript( 0 ) + '.  While you might have considered him large before you came to this place, the sensation is now merely pleasant, and you can\'t help but groan in slight disappointment.  ', false );
			//<<Cor 50+>>;
			if( CoC.player.cor >= 50 ) {
				EngineCore.outputText( 'You take comfort in knowing that at least there is a cock inside of you, and that soon it will be filling you with its seed.  Perhaps it might even impregnate you!  ', false );
			}
			EngineCore.outputText( 'The imp seems to have shared your initial annoyance, and suddenly you feel strange and harsh objects prodding your ' + Descriptors.vaginaDescript( 0 ) + ' near where you are being penetrated.  Suddenly you feel yourself being forced open even wider, and you feel almost as if you are getting kicked inside of your pussy.  A second object touches near where the first had entered and you quickly brace yourself against a nearby tree.  The second jolt is even harder, feeling as if your cervix is getting stomped.  You howl out in pain as your pussy is virtually torn open, the imp using your tail to leverage not only his ' + CoC.monster.cockDescriptShort( 0 ) + ' but also his legs inside your ' + Descriptors.vaginaDescript( 0 ) + '.  ', false );
			//<<Cor <80>>;
			if( CoC.player.cor < 80 ) {
				EngineCore.outputText( 'Tears pour out of your eyes and you are sure you must be bleeding slightly, ', false );
			}
			//<<Cor <50>>;
			if( CoC.player.cor < 50 ) {
				EngineCore.outputText( 'and you hang on to the tree, afraid of the pain from even the slightest movement.  ', false );
			}
			//<<Cor 50+>>;
			else {
				EngineCore.outputText( 'and you hang on to the tree, grunting like a rutting animal as you delight in the intense pain.  ', false );
			}
			//<<Cor 80+>>;
			if( CoC.player.cor >= 80 ) {
				EngineCore.outputText( 'You howl out in pain and pleasure, bucking and hoping to intensify the sensation, hurling enticements and insults at the imp like a slut.  ', false );
			}
			//<<Cor 50+, Breasts>>;
			if( CoC.player.cor >= 50 && CoC.player.biggestTitSize() >= 2 ) {
				EngineCore.outputText( 'You release the tree as you begin playing with your ' + CoC.player.allBreastsDescript(), false );
				//<<w/ nip-pussies>>;
				if( CoC.player.hasFuckableNipples() ) {
					EngineCore.outputText( ' and shoving your fingers into your ' + Descriptors.nippleDescript( 0 ) + '.  ', false );
				} else {
					EngineCore.outputText( '.  ', false );
				}
				//<</Breasts>>;
			}
			EngineCore.outputText( 'The imp is pushing deeper and deeper and in moments you cry out again as you feel first its hooves and then its ' + CoC.monster.cockDescriptShort( 0 ) + ' tearing open your cervix and bottoming out in your womb.  ', false );
			//<<Asshole large+>>;
			if( CoC.player.analCapacity() >= 35 ) {
				EngineCore.outputText( 'When the imp realizes it cannot go any further you feel its hands against your asshole, and your eyes go wide in realization of what it is planning on doing.  Lubed up by your now drooling juices, the fist pushes hard into your ' + Descriptors.assholeDescript() + ', shoving past your ring-muscles.  ', false );
				//<<Assole <gaping, Cor <80>>;
				if( CoC.player.ass.analLooseness < 4 && CoC.player.cor < 80 ) {
					EngineCore.outputText( 'Your howl of pain leaves your throat raw.  ', false );
				} else {
					EngineCore.outputText( 'Your howl of perverse pleasure leaves your throat raw.  ', false );
				}
			}
			EngineCore.outputText( '\n\nIt is a relief when you feel the creature\'s sperm filling your womb and lubricating your raw cervix, your own body is wrecked by an intense orgasm while it breeds you.  You pass out, waking up to find that the imp has slipped out of you and is lying unconscious and coated completely in a mixture of your juices and his own. After looking for anything you might be able to take away from him you limp away, you ', false );
			if( CoC.player.cor < 80 ) {
				EngineCore.outputText( 'promise to yourself that you will not do that again.', false );
			} else {
				EngineCore.outputText( 'find your cunt juices already dripping down your legs in anticipation of doing this again.', false );
			}
			CoC.player.orgasm();
			Combat.cleanupAfterCombat();
			return;
		}
		CoC.player.orgasm();
		Combat.cleanupAfterCombat();
	};
	/*
	 {{Any player Give}}
	 <<Cor <30>>You look furtively at the imp's [imp cock desc] as the creature masturbates shamelessly on the ground in front of you.  Unable to help yourself, you trot closer and closer, leaning in to get a better look at its giant member.  A lustful part of you wonders what the dripping pre-cum would taste like against your tongue.<<else if Cor <50>>You look lustfully at the imp's [imp cock desc] as the creature masturbates shamelessly on the ground in front of you.  Licking your lips in anticipation you walk closer, lowering your head to better inspect it.  <<else>>Your grin betrays your lust as you watch the imp masturbate its [imp cock desc] shamelessly on the ground.  Your hands already drift over your body as you trot over and grab a hold of its [imp cock desc], bringing it to your eager lips.<</Cor>>  The Imp's eyes shoot open as its hands grab a hold of your [hair desc - if no hair, then ears] and it pulls its member against your lips.  With your guard down, images of fellating the [imp cock desc] fill your mind with overwhelming intensity.  The visions cause your jaw to fly open without any trace of your own volition, and suddenly the [imp cock desc] is forcing its way to the back of your throat.  <<Cor <40>>Your gag reflexes are trying desperately to kick in, serving only to massage the [imp cock desc] as the creature makes guttural noises and pushes its self even deeper. <<else if Cor <70>> Though it takes you a moment to get adjusted to the intrusion, soon you are able to relax your throat like an expert cock-swallower, taking it even deeper. <<else>>You moan around the creature's [imp cock desc], opening your throat as your eyes plead with it to fuck your mouth-hole even deeper.<</Cor>>
	 The creature's pre-cum tastes more like brimstone than salt, and yet something about it inflames you as it pools in your mouth and pours down your throat.  <<Cor <30>>It is disgusting to let this substance inside your body, but the images keep you from resisting. <<else Cor <60>>The corrupt fluids seem unusual, but something about the lewd act makes them more than worthwhile and you take some delight in knowing they are filling your body. <<else>><<If Pussy>>Your [pussies desc] start drooling juices, <</Pussy>><<If cock and pussy>>and your<<else If Cock>>Your cock grows rock hard<</If>>as you feel the corrupt fluids flowing throughout your body.<</Cor>> Without even having to think about it you reach out and <<Str <80>>stroke its [imp cock desc], trying to milk more of it into you <<else>>pick up the imp with one hand, your other hand stroking its [imp cock desc] and trying to milk more of it into you<</Str>><<Cor 80+, Str <80>> as you shove a finger into its [imp anus desc]<<else Cor 80+, Str 80+>> then shoving a finger into its [imp anus desc] and using the new form of grip to move the creature into and out of your mouth-hole<</Cor>>.<<Goto I3 then return>>  In only a few minutes the creature begins to lose its ability to resist your <<Cor <30>>tight<<else Cor <60>> skilled <<else>> eager <</Cor>> throat and begins to pour massive amounts of corrupt cum into your stomach. <<Cor 60-79>>As much as you love having your stomach filled with sperm, you quickly pull the imp back so that some of it might land on your tongue for you to savor.  The excessive cum is soon dripping down your lips, no matter how fast you try to swallow.<<else Cor 80+>>As much as you love having your stomach filled with sperm, a perverse thought fills you and you pull the creature out, <<Str 80+>>holding the creature over your head as <</Str>>you guide its [imp cock desc] to liberally coat your face <<Breasts>>and [breasts desc]<</Breasts>>.<</Cor>>You lick your lips clean of the creamy mess as you put down the now unconscious Imp and give it a look-over for valuables.  <<Cor 80+>>As you trot back the way you have come you idly trace a finger through the dangling sperm, hoping someone might see what a [slur] you have become becomes too uncomfortable to wear.  Though if you have to clean it off, you can always get more.. perhaps from an even more copious source.<<end>>
	 {{Any player Receive}}
	 As you watch the imp stroking its [imp cock desc] you find it difficult to resist the urge to feel that massive member sliding into your body.  Slowly you trot closer, turning around to display your rear to the creature.  <<Pussy, Cor <30>>Your [largest pussy desc] is already drooling in anticipation of the cum it is about to receive, though to your surprise you feel the imp's [imp cock desc] bumping slightly above it.  You try to turn and stop it, but the creature pushes deep past your anal muscles before you have a chance.<<else>><<Pussy, Cor <50>>>>Your [largest pussy desc] is already drooling in anticipation of the cum it is about to receive, though to your surprise you feel the imp's [imp cock desc] bumping slightly above it. You brace yourself in anticipation and slight trepidation, delighting in the perversion you are about to take part in. <<else Pussy, Cor 50+>>Though your [largest pussy desc] is dripping at the chance at being bred, you feel like you would like somehing a lot more raw.  Breathlessly you beg it to fuck your [anus desc], debasing yourself and lowering yourself to the ground so you can be as accessile as possible. You moan like a [slur] in anticipation of feeling a cock shoved deep into your [anus desc] <<Breasts>>gripping your nipples hard<<else>>raking your body with your nails<</Breasts>>as you try to keep from biting through your lips.  <</Pussy,/Cor>><<no Pussy>><<Cock>>Your [cocks desc] harden in anticipation<<else>>You rake your nails over your sides in anticipation<</Cock>> as you feel the creature prepare to mount you, its [imp cock desc] pressing up against your [anus desc].  <</no pussy>>
	 <<Cor 30+, Cor <50>> As the imp slowly pushes into your [anus desc] you moan in animalistic pleasure.<<else>>When you begin to feel your [anus desc] being distended you cry out and beg it to shove it harder, faster, to take your asshole as roughly as it can!<</Cor>><<anus smaller than dick>>The sheer size of the [imp cock desc] tears your anus open, sending streams of pain into you as you cry out in agony.[if anus smaller than dick, increase size]<</anus>>
	 [if anal virgin, lose anal virginity]
	 The Imp grunts as it ruts your [anus desc], and you can feel it bumping deeply against your bowels.  After a few minutes the initial pain is gone and you find yourself making bestial sounds along-side the overly-endowed creature.  You long to feel its cum filling you to overflowing, and break into a slight trot that causes the small imp to bounce around inside of your tightening asshole.  The combination of movement, grip, and its own furious thrusting seems to push it over the edge and you can feel jets of sperm shooting deeply into you, sending you into your own anal orgasm.  Used to the limit, the imp slides out of you and drops to the ground, barely conscious. <<Cor 80+>>Grinning at the perversity, you lower yourself down and take its dirty [imp cock desc] into your mouth, cleaning it thoroughly as you enjoy the mixture of your juices.  Your intense sucking and stroking causes a few last spurts of cum to fly out, and you pull the imp out lock enough to shoot the gouy mess over your face and hair while you swallow what was already in your mouth.<<end>>
	 {{Player has breast-pussies and is E+ sized breasts}}
	 As the imp falls to the ground, furiously masturbating its [imp cock desc] you smile in delight, your [nip-pussy desc] already beginning to grow wet <<lots of milk>>with the massive flow of milk pouring out of them<</milk>>.  You approach the little Imp at an eager trot, lowering yourself down and encasing its [imp cock desc] in your [breasts desc].  Its eyes fly open and stare in wicked delight at what it sees, quickly reaching out and beginning to fondle and finger your [nip-pussy desc].  Unable to resist any more, you press the opening of one of your [breasts desc] against the tip of the [imp cock desc].  If the creature is confused it does not show it, shoving its self hard quickly and hard into your tit.  [if virgin-nip, lose virginity]<<nip-size smaller than dick size>>Pain shoots through you as you feel the [nip-pussy desc] being forced to widen by the imp's massive tool, and you let out a slight scream [increase nip-pussy size]<</smaller>>  Without missing a beat the creature wraps its hands around your [breast desc] and begins thrusting liberally into it as if your tit was nothing more than a giant and perverted fuck-toy.  Seeing no point in arguing with the perception, you reach over and start shoving your own finger into your other [nip-pussy desc], crying out as you urge the imp to use your [breast desc].  Part of you longs to feel the imp's thick and corrupted cream filling your tit-hole, <<Cor <80>> and you begin moving your breast in circles around the thrusting member. <<else>>and you lower your breast against a rock, letting the imp squish your breast under its weight, grinding it into the rough stone as it continues to fuck it<</Cor>>.  The Imp seems to really enjoy this and after a few more minutes of intense pleasure it begins pouring its cum inside of your chest.  Without anywhere to go the cum pours back out, mixed with torrents of milk that are being stimulated out of you.  Exhausted the imp falls to the ground <<Cor <30>>leaving you frustrated. [no lust reduction] <<Cor <50>>before it can see you bringing your nipples to your mouth and sucking on the spermy mixture until you bring yourself to orgasm. <<Cor 80+>>before it can see you bringing your nipples to your mouth.  You suck hard to get to as much of its sperm as you can, shoving your tongue deep into yourself and digging around wih your fingers.  When this is not enough to bring you to orgasm you slap and bite your [nip-pussy desc], crying out as the intensity and perversion finally proves enough to push you over the edge.<</Cor>><<end>>
	 */
	ImpScene.prototype.centaurOnImpResults = function( iNum ) {
		var x = CoC.player.cockThatFits( CoC.monster.analCapacity() );
		if( x < 0 ) {
			x = 0;
		}
		//{{ GoTo results }};
		//<<I1>>;
		if( iNum === 1 ) {
			//<<cum multiplier: lots>>;
			if( CoC.player.cumQ() >= 250 ) {
				//<<no knot>>;
				if( CoC.player.cocks[ x ].cockType !== CockTypesEnum.DOG ) {
					EngineCore.outputText( 'Soon the amount is overflowing from the abused ' + Appearance.assholeDescript(CoC.monster) + ', dripping between you with no sign of stopping as you continue thrusting yourself into the imp.  ', false );
				}
				//<<knot>>;
				else {
					EngineCore.outputText( 'Soon the abused ' + Appearance.assholeDescript(CoC.monster) + ' is full to the brim, though your knot keeps any from escaping while more and more pumps in.  Soon the creature\'s belly is distending and the imp is gasping wordlessly. ', false );
				}
				EngineCore.outputText( 'When your ' + Descriptors.cockDescript( x ) + ' finally emerges a torrent of cum follows out of the distended hole and covering the back of the creature\'s legs.  ', false );
				//<<I1_1>>;
				//<<2 cocks>>;
				if( CoC.player.cockTotal() === 2 ) {
					EngineCore.outputText( 'Your other cock drenches the imp\'s back with its own secretions that immediately start dripping down its sides.  ', false );
				}
				//<<3+ cocks>>;
				if( CoC.player.cockTotal() > 2 ) {
					EngineCore.outputText( 'Your other cocks release their cum all over the creature\'s back and sides, leaving it a glazed mess.  ', false );
				}
				//<</I1_1>>;
				EngineCore.outputText( 'You leave him panting and lapping at a pool of your semen.', false );
			}//<</multiplier>>
			//<<cum multiplier: little-normal>>;
			else {
				EngineCore.outputText( 'With a last thrust into the cum receptacle you begin slowing down, even as its own ' + CoC.monster.cockDescriptShort( 0 ) + ' spills its seed over the ground.  ', false );
				//<<I1_1>>;
				//<<2 cocks>>;
				if( CoC.player.cockTotal() === 2 ) {
					EngineCore.outputText( 'Your other cock drenches the imp\'s back with its own secretions that immediately start dripping down its sides.  ', false );
				}
				//<<3+ cocks>>;
				if( CoC.player.cockTotal() > 2 ) {
					EngineCore.outputText( 'Your other cocks release their cum all over the creature\'s back and sides, leaving it a glazed mess.  ', false );
				}
				//<</I1_1>>;
				EngineCore.outputText( 'You leave him panting and draped over the mossy boulder in a pool of your joint cum.', false );
			}
			return;
		}
		if( iNum === 2 ) {
			//<<cum multiplier: lots>>;
			if( CoC.player.cumQ() >= 250 ) {
				EngineCore.outputText( 'The imp\'s eyes widen in at the amount pouring in, and gobs of sperm begin overflowing down its chin.  ', false );
				//<<(lots cont.)  cum multiplier: excessive>>;
				if( CoC.player.cumQ() >= 500 ) {
					EngineCore.outputText( 'No matter how fast it is swallowing it does not seem to be enough, and soon its belly is distended and its skin is covered in a thick coating of cum.  ', false );
				}
				//<</multiplier>>  ;
			}
			EngineCore.outputText( 'Sated you trot away and leave the creature licking its lips and fingers, its eyes following you with lustful cunning.', false );
			//<</I2>>;
			return;
		}
		//<<I3>>;
		if( iNum === 3 ) {
			//<<Has Breasts>>;
			if( CoC.player.biggestTitSize() >= 2 ) {
				EngineCore.outputText( 'As the sensations intensify you reach up and begin massaging your ' + Descriptors.breastDescript( 0 ) + ' and playing with your ' + Descriptors.nippleDescript( 0 ) + 's.  ', false );
				//<<(breasts cont.) nips have pussies>> ;
				if( CoC.player.hasFuckableNipples() ) {
					//<<nip-pussies and milk>>;
					if( CoC.player.biggestLactation() >= 1 ) {
						EngineCore.outputText( 'Milk streams out from your ' + Descriptors.nippleDescript( 0 ) + 's as if they had been recently filled with dripping cum.  ', false );
					} else {
						EngineCore.outputText( 'Your fingers slide faster and faster into your ' + Descriptors.nippleDescript( 0 ) + 's even as the imp begins to stroke itself under you.  ', false );
					}
				}
				//No pussies;
				else {
					//<<else no pussies, has milk>>;
					if( CoC.player.biggestLactation() > 0 ) {
						//<<little milk>>;
						if( CoC.player.biggestLactation() <= 1 ) {
							EngineCore.outputText( 'Beads of milk begin to drip down your chest and occasionally spurt outward.  ', false );
						}//<<else>>;
						else {
							EngineCore.outputText( 'Milk pours out of your ' + Descriptors.breastDescript( 0 ) + ' and streams down your body.  ', false );
						}
					}//<</milk>>
				}
			}//<</Breasts>>
			return;
		}
	};
	ImpScene.prototype.areImpsLactoseIntolerant = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You advance on the masturbating imp, baring your ' + CoC.player.allBreastsDescript() + ' and swinging them from side to side. The little creature watches them, mesmerized as he masturbates his foot-long erection.\n\n', false );
		EngineCore.outputText( 'You sit down in front of the little creature and grab ahold of his hair. The imp squeals slightly in pain before his cries are silenced with a ' + Descriptors.nippleDescript( 0 ) + '.  It fills his mouth as he yields, defeated. At once he starts to drink down as much of your milk as he can.\n\n', false );
		EngineCore.outputText( 'After a moment, he takes one of his hands off his large member and puts it against your ' + Appearance.biggestBreastSizeDescript() + ' to steady himself as he continues to nurse. You give a pleased sigh and simply bask in the sensations of pleasure that being nursed gives you.  You ruffle the little imp\'s hair affectionately. "<i>These creatures are so much nicer to be around when they just take their minds off their cocks,</i>" you think as you see his other hand relax and stop rubbing his swollen, demonic member.\n\n', false );
		EngineCore.outputText( 'You feel the imp\'s mighty gulps start to slow down until he lets out a sigh of relief. While imps may be small, they\'re very hungry creatures. Your ' + Descriptors.nippleDescript( 0 ) + ' slips out of the imp\'s mouth, and you gently lay it down on the ground. It gives a few gentle burps before dozing off; you can see that the imp\'s erection has retracted, and its belly has expanded significantly. You smile to yourself and, feeling fully satisfied, you stand up.', false );
		//set lust to 0, increase sensitivity slightly;
		EngineCore.dynStats( 'lib', 0.2, 'lus', -50 );
		CoC.player.milked();
		Combat.cleanupAfterCombat();
	};
	ImpScene.prototype.impGangabangaEXPLOSIONS = function() {
		CoC.player.slimeFeed();
		EngineCore.spriteSelect( 18 );
		//Set imp monster values;
		//Clear arrays in preparation;
		CoC.monster = new ImpGang();
		EngineCore.outputText( '\n', false );
		EngineCore.outputText( '<b>You sleep uneasily. A small sound near the edge of your camp breaks into your rest and you awaken suddenly to find yourself surrounded by ' + CoC.monster.a + '</b>!\n\n', false );
		//CENTAUR;
		if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
			if( Utils.rand( 2 ) === 0 && (CoC.player.cockTotal() === 0 || CoC.player.gender === 3) ) {
				//(First encounter);
				if( CoC.player.findStatusAffect( StatusAffects.ImpGangBang ) < 0 ) {
					EngineCore.outputText( 'The imps stand anywhere from two to four feet tall, with scrawny builds and tiny demonic wings. Their red and orange skin is dirty, and their dark hair looks greasy. Some are naked, but most are dressed in ragged loincloths that do little to hide their groins. They all have a ' + CoC.monster.cockDescriptShort( 0 ) + ' as long and thick as a man\'s arm, far oversized for their bodies. Watching an imp trip over its ' + CoC.monster.cockDescriptShort( 0 ) + ' would be funny, if you weren\'t surrounded by a horde of leering imps closing in from all sides...\n\n', false );
					CoC.player.createStatusAffect( StatusAffects.ImpGangBang, 0, 0, 0, 0 );
					EngineCore.outputText( 'The imps leap forward just as you start to ready your ' + CoC.player.weaponName + ', one sweaty imp clinging to your arm', false );
					//(If the player has a weapon);
					if( CoC.player.weaponName !== 'fists' ) {
						EngineCore.outputText( ' while another kicks your weapon out of reach', false );
					}
					EngineCore.outputText( '.  The ' + CoC.monster.short + ' surges forward and grapples you. Imps grope your body and hump their ' + CoC.monster.cockDescriptShort( 0 ) + ' against your horse legs, smearing their sweat and pre-cum into your ' + CoC.player.skinDesc + '. The rest of the ' + CoC.monster.short + ', a dozen or more imps, all leer at you and laugh as they slap and pinch your body. The imps have sharp claws, tiny sharp teeth, and short horns on their heads. They scratch, claw, and bite at you with all of these weapons as they try to pull you down to the ground. One bold imp leaps forward and grabs your ', false );
					//(If the player has a cock)";
					if( CoC.player.cockTotal() > 0 ) {
						EngineCore.outputText( Descriptors.cockDescript( 0 ), false );
					}//(If the player has breasts);
					else {
						EngineCore.outputText( Descriptors.nippleDescript( 0 ), false );
					}
					EngineCore.outputText( ', twisting and pinching hard enough to make you yelp in pain. An imp leaps up and mounts you, grabbing your ' + Descriptors.hairDescript() + ' like reins. The long flesh of his ' + CoC.monster.cockDescriptShort( 0 ) + ' rubs against the small of your back. The ' + CoC.monster.short + ' stinks of sweat and pre-cum, its moist grip and obscene smirk leaves you with no doubt as to what they will do to you if you lose this fight.\n\n', false );
				}
				EngineCore.outputText( 'The horde drags you to your knees, grappling your legs and crawling over your horse-body to pin you down. You try to buck them off but there are too many to fight. The imps drag your arms behind your back, wrapping them around your rider. Another imp whips off his loincloth to reveal his pre-cum drooling ' + CoC.monster.cockDescriptShort( 0 ) + ' and tosses the cloth to the imps holding your arms. They quickly tie your arms back with the sweat-damp loincloth.  ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 1 ) {
					EngineCore.outputText( 'Having your arms tied behind your back forces your chest out, making your ' + CoC.player.allBreastsDescript() + ' stand out. They bounce as you struggle.  ', false );
				}
				EngineCore.outputText( 'The ' + CoC.monster.short + ' stroke themselves and rub their hands over your outstretched chest, smearing their pre-cum into your skin. The imp riding you bounces up and down, rubbing his sweaty ' + CoC.monster.ballsDescriptLight() + ' against your ' + CoC.player.skinDesc + ' while he yanks your hair.  ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'Your face flushes with humiliation. Your imp rider twists your ' + Descriptors.hairDescript() + ' hard and you whimper in pain. Imps rub their cocks along your ' + Descriptors.hipDescript() + ' while others stroke themselves and jeer at your helplessness.  ', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( CoC.monster.getCapitalA() + ' swarms over your body, some stroking themselves as they watch you squirm while others rub their cocks over your flanks. Your imp rider twists your hair, pulling your head back, and you moan in pleasure at the rough handling. Your ' + CoC.player.skinDesc + ' tingles as you start to flush with desire.  ', false );
				}
				EngineCore.outputText( 'You yelp in shock as you feel a sharp slap on your ass. You look back to see an imp pulling your tail up. He grins at you and slaps your ' + Descriptors.hipDescript() + ' again. He yanks your tail and slaps your ass one last time, then dives down to plant his face in your ' + Descriptors.vaginaDescript( 0 ) + '. His inhumanly nimble tongue teases the folds of your pussy and flicks at your ' + Descriptors.clitDescript() + '.  ', false );
				//(If the player has balls);
				if( CoC.player.balls > 0 ) {
					EngineCore.outputText( 'The tongue slides over your ' + Descriptors.sackDescript() + ', coating it with warm drool.  ', false );
				}
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You shake your hips, trying to escape the demonic tongue. The imp grips your ' + Descriptors.hipDescript() + ' and pulls his face further into your cunt, sliding his nimble tongue over your lips. You grit your teeth, trying to ignore the warmth spreading from your ' + Descriptors.vaginaDescript( 0 ) + '.', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'You let out a shuddering sigh as the heat from your cunt spreads into the rest of your body. Your ' + Descriptors.hipDescript() + ' tremble as the tongue slides over the folds of your ' + Descriptors.vaginaDescript( 0 ) + '. The imp grips your flanks harder and dives his nimble tongue into your fuck-hole.', false );
				}
				EngineCore.outputText( '\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 1 ) {
					EngineCore.outputText( 'Hands slide over your ' + CoC.player.allBreastsDescript() + ', dragging your attention back to the front of the mob. Two imps grope your ' + Appearance.biggestBreastSizeDescript() + ', mauling your flesh as they drag your tits around your chest. They lick your tit-flesh, slowly working their way up towards your ' + Descriptors.nippleDescript( 0 ) + '. The imp rider drops your hair and reaches around you, shoving his cock against your back as he squeezes your ' + Appearance.biggestBreastSizeDescript() + '. Finally the imps reach your nipples, their tongues wrapping around and pulling at the tingling flesh.  ', false );
					//(Low Corruption);
					if( CoC.player.cor < 50 ) {
						EngineCore.outputText( 'You can\'t escape the tongues lapping and pulling at your ' + Descriptors.nippleDescript( 0 ) + ', matching the one in your cunt. You shake your head to deny the pleasure, but your breathing comes faster and faster as lust invades your body.', false );
					}
					//(High Corruption);
					else {
						EngineCore.outputText( 'The tongues squeezing and tugging your nipples match the tongue working your ' + Descriptors.vaginaDescript( 0 ) + ', flooding your body with lust. You moan and arch your back, offering your tits to the imps. You can hear your pulse pounding in your ears as you pant with desire.', false );
					}
					EngineCore.outputText( '  Suddenly you feel tiny needle-sharp teeth pierce your ' + Descriptors.nippleDescript( 0 ) + '. You scream as venom pumps into your tits, red-hot poison that makes your ' + CoC.player.allBreastsDescript() + ' feel as though they were being stung by bees. You moan in pain as your breasts start to swell, the imps continuing to pump demon-taint into them.\n\n', false );
					//Grow tits!;
					CoC.player.growTits( 2, CoC.player.breastRows.length, false, 1 );
					CoC.player.boostLactation( 0.3 );
				}
				EngineCore.outputText( 'Dimly through your haze of lust and pain you see a large imp step forward from the mob. Four feet tall and broader and stronger looking than any imp you\'ve seen before, with a face as much bull as imp, this new imp has mottled grey skin, broad purple demon wings, two curving bull-horns on his head, and a ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' big enough to choke a minotaur. The mushroom-like head of it bobs just below his mouth, and his snake-tongue darts out to flick a bit of pre-cum off the head and onto your face. You shudder as the hot fluid stings the sensitive skin of your lips. His ' + CoC.monster.ballsDescriptLight() + ' are each the size of your fist and slick with sweat. He slaps his sweaty cock-head against your cheek, nearly scalding you with the heat.  ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You yelp and twist your head to escape the heat.  ', false );
				}
				//(End low corruption) ;
				EngineCore.outputText( 'He slowly rubs his shaft over your cheeks and along your lips, each ridge of his demonically-hot ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' tugging at your lips. The hot pre-cum dribbles over your sensitive flesh and the musk makes your sinuses tingle. The big imp sneers as you whimper, and whips his bull-shaft back to slap your face. The other imps watch and stroke themselves as their master cock-whips you.\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'The big imp grabs one of your painfully distended breasts in each hand, mauling and bouncing the flesh as if weighing them. You gasp in pain as your ' + CoC.player.allBreastsDescript() + ' swell further at his touch. ', false );
				}
				EngineCore.outputText( 'Hot pre-cum dribbles through your lips and onto your tongue. The steaming salty goo is almost too hot to stand, and you stick your tongue out to cool it. The imps jerk their cocks harder as you pant, tongue hanging out of your mouth. The master imp steps back and looks you up and down, admiring his handiwork. His snake-tongue darts out to an incredible length and wraps itself around your tongue. He licks his pre-cum from you, then forces his tongue into your mouth. The master imp\'s tongue curves back into your mouth, pressing the glob of pre-cum into your throat. ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'It\'s either swallow or have that demon-tongue forced all the way down your throat. Against your will you gulp back the glob.', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'You swallow the glob of pre-cum eagerly, trying to suck the demon\'s tongue into your throat.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'The big imp walks around you, casting his gaze over your pinned body.  ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'The other imps reclaim your aching breasts, sucking your ' + Descriptors.nippleDescript( 0 ) + ' and mauling your ' + CoC.player.allBreastsDescript() + ' so hard their fingers disappear into your swelling flesh. ', false );
				}
				EngineCore.outputText( 'The imp rubs his hands over your sides and flanks, his ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' bobbing as he walks. The other imps watch their master as he moves around you. Only the imp sucking your ' + Descriptors.vaginaDescript( 0 ) + ' doesn\'t notice, his tongue thrusting deeply into your folds. The big imp grabs him by the neck and easily tosses him aside, his tongue dragging through your cunt as he\'s pulled away from you. The master imp takes position behind you and grabs his ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ', bringing the mushroom-head of it down to your pussy. You shake, knowing what\'s coming next. The other imps watch and stroke themselves as their master readies his hips to push into you.\n\n', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You scream for help', false );
				}
				//(High corruption) ;
				else {
					EngineCore.outputText( 'You moan with lust', false );
				}
				EngineCore.outputText( ' as the inhumanly hot cock-head stretches your pussy lips, your cries vanishing into the dark skies above. Your rider grabs your hair to pull your head back, and you cry out as his master pushes his corrupted cock into you.  ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 1 ) {
					EngineCore.outputText( 'The imps working your breasts suck harder, kneading your tit-flesh as though trying to milk you. ', false );
				}
				EngineCore.outputText( 'You squirm and twist against the imps holding you down as the hot ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' almost burns your sensitive cunt. You can smell the sweat steaming off his shaft, and your pussy-fluids start to steam as well as he forces his cock-head into your ' + Descriptors.vaginaDescript( 0 ) + '. His huge cock-head bulges your groin, and you moan', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( ' in helpless terror as you feel the bulge work up from the base of your groin towards your stomach. You let out a shuddering moan of pain as inch after inch of monstrous ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' stretches your belly', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( ', panting in lust as the monstrous ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' pushes your flesh aside to make room for itself', false );
				}
				EngineCore.outputText( '. ', false );
				//(This is a good place for the virginity-loss message, if needed);
				CoC.player.cuntChange( CoC.monster.cockArea( 1 ), true );
				EngineCore.outputText( 'You can feel every ridge and pulsing vein of his cock pulling on the lining of your stretched cunt. You tremble helplessly around the huge shaft, fully impaled on the imp\'s mutated bull-cock.\n\n', false );
				EngineCore.outputText( 'Every pulse of his heart makes his cock twitch, making you shake in time to the shaft pulsing in your cunt. The imps jeer at you, masturbating over your shaking body. The big imp flexes his thighs, and his cock-head throbs deep in your belly. The other imps laugh as you ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'whimper, spasming as the hot shaft presses against new areas', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'moan in pleasure, rotating your hips around this incredible cock', false );
				}
				EngineCore.outputText( ' in your stuffed ' + Descriptors.vaginaDescript( 0 ) + '. The big imp sneers and flexes his cock again, watching ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() >= 2 ) {
					EngineCore.outputText( 'your ' + CoC.player.allBreastsDescript() + ' roll on your chest as you squirm', false );
				}//(If the character doesn't have breasts);
				else {
					EngineCore.outputText( 'your eyes roll back as you squirm', false );
				}
				EngineCore.outputText( '.\n\n', false );
				EngineCore.outputText( 'Finally the big imp pulls back his ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ', each ridge pulling on your pussy flesh as he slides out. You yelp and buck as the mushroom-head catches on your folds. ', false );
				//(If the character has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' bounces as the bulge passes over it.  ', false );
				}
				EngineCore.outputText( 'You moan as the mushroom-head reaches the entrance of your ' + Descriptors.vaginaDescript( 0 ) + ', your stretched pussy-flesh slowly returning to normal. The master imp pushes forward again, reclaiming your pussy for his monstrous cock. ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You try to buck your ' + Descriptors.hipDescript() + ', fighting to break free as the bulge of his cock-head works its way high up into your belly. You\'re held down by too many imps. You can only writhe around the hot shaft stretching out your ' + Descriptors.vaginaDescript( 0 ) + '. The big imp grunts as his cock-head pops past your cervix, and you moan and shake in pain.  ', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'You moan in ecstasy as the hot ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' pushes deep into your ' + Descriptors.vaginaDescript( 0 ) + ', turning every inch of your pussy into a pleasure-sheath for the big imp. You know you\'re nothing but a fuck-toy for this corrupt creature, just a wet pussy for him to fill with cum, and the thought almost makes you orgasm as he forces his huge cock-head past your cervix.  ', false );
				}
				EngineCore.outputText( 'Finally the corrupt cock bottoms out against your womb. The imp pulls back again, and starts to fuck you slowly.\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() >= 2 ) {
					EngineCore.outputText( 'The slow fucking shakes your breasts, and the imps sucking at your nipples cling tightly to your monstrously swollen ' + CoC.player.allBreastsDescript() + '. Your ' + Appearance.biggestBreastSizeDescript() + ' have grown three cup sizes since the imps pumped their venom into you. An ache starts deep in the base of your tits and works its way to your sore ' + Descriptors.nippleDescript( 0 ) + '. Your already bloated nipples swell as the imps suckle and you gasp as the first rush of milk spills into their mouths. Your rider reaches around and starts to milk your udders, moving his hands between your ' + CoC.player.allBreastsDescript() + ' and forcing out more milk for his gangmates.\n\n', false );
				}
				EngineCore.outputText( 'The big imp grinds his hips as he thrusts and pulls, rubbing his cock-ridges against every part of your ' + Descriptors.vaginaDescript( 0 ) + '. While sliding his mutated ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' in and out of you, the imp rubs his hands along your mound, pulling it open or forcing it tight as he takes you. Your pussy juices steam off his cock as he pumps, and hot pre-cum dribbles down your crack and ', false );
				//(If the character has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( 'over your ' + Descriptors.multiCockDescriptLight() + ' where it ', false );
				}
				EngineCore.outputText( 'drips onto the ground. ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'The pain as this huge cock stretches you is overwhelming, but every thrust rubs more corrupt pre-cum into your pussy walls. You start to pant as the imp rapes you, using your body for his own pleasure. You tremble as the heat of his pre-cum soaks through your body. The huge shaft forces your ' + Descriptors.clitDescript() + ' out, and the steaming fluids splashing on it make it tingle almost painfully. Your whimpers and moans of pain start to take on a different tone, and the master imp starts to fuck you faster.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'Pain and pleasure blend into one as the huge ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' stretches you, rubbing pre-cum into your steaming pussy. You moan as the big imp fucks you, turning you into a mindless fuck-puppet. Your ' + Descriptors.clitDescript() + ' swells painfully as hot juices splash over it. Your shaking body only adds to the master imp\'s pleasure.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'The other imps continue to jerk-off over you as the big imp impales you again and again on his shaft. Their pre-cum starts to splatter down on your body, and they pant as they watch your orgasm build. ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 1 ) {
					EngineCore.outputText( 'Imps gulp milk from your bloated ' + Appearance.biggestBreastSizeDescript() + '. As one imp drinks his fill and staggers away with a sloshing belly, another steps up to pump your milk-spewing udders.  ', false );
				}
				//(If the character has a dick);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' swell painfully as the rough fucking pumps blood into your groin.  ', false );
				}
				EngineCore.outputText( 'The big imp\'s snake tongue flicks out and slides around your ' + Descriptors.vaginaDescript( 0 ) + ', pulling at your pussy lips. He moves his tongue back and forth along the sides of your steaming cunt, alternating between stretching and flicking the lips. ', false );
				//(If the character has a dick);
				if( CoC.player.totalCocks() > 0 ) {
					EngineCore.outputText( 'He draws his tongue back and wraps it around your ' + Descriptors.cockDescript( 0 ) + ', sliding its length along your shaft and flicking his tongue over your cock-head.  ', false );
				}
				EngineCore.outputText( 'You gasp in time to the big imp\'s thrusts, whimpering when his cock or tongue hit a sensitive point. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You\'re being raped by a demon, milked like a cow, and you\'re about to cum hard. This corrupted land has left its mark on you.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'This corrupted land has left its mark on you. You could never have taken a cock this big before you arrived here.', false );
				}
				EngineCore.outputText( ' You moan as you rise towards your orgasm.\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 3 ) {
					EngineCore.outputText( 'Your udders shake back and forth under your chest in time to the rough fucking. You arch your back to press your ' + Descriptors.nippleDescript( 0 ) + ' into eager mouths, moaning as your rider milks your distended ' + CoC.player.allBreastsDescript() + '. ', false );
				}
				//(Low Corruption).;
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'Some part of you can still feel shame, and you whine and clench your teeth as the urge to <i>moo</i> rises in you.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'You moan shamelessly as you\'re fucked and milked, and the moans turn to long <i>mooos</i> of ecstasy.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'The master imp pounds into you as hard as he can, driving his ' + CoC.monster.cockDescriptShort( 1 ) + ' deeper into your cunt. His grunts come closer and closer together. Your rider grinds his cock into your back, rubbing his cock-head in your hair. He nips at your neck and shoulder as he pants. The master imp pounds into you and you can feel his ' + CoC.monster.ballsDescriptLight() + ' swell as they slap against you. Through the haze of your approaching orgasm you realize what\'s about to happen. Those oversized balls are about to pump more cum into you than any normal man could ever produce. They\'re going to pump demonic cum right into your womb. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You scream as the base of his ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' bloats with corrupted jism, the thick bulge stretching your pussy even more as it pumps along the imp\'s shaft. The bulge swells your belly and you can feel it move through your stretched cunt towards your womb. Another thick bulge forms at the base of the master imp\'s cock and you thrash wildly, yelling in protest. "<i>NOO - O - O - OOOOHhh!</i>" The hot cum floods into your womb and you reach your own orgasm, shaking as your ' + Descriptors.vaginaDescript( 0 ) + ' clamps down on his cock and milks it of waves of cum. Another orgasm hits on the heels of the first one, and you buck as more demon-cum floods your womb. Gasping for air, you continue to come as your belly swells. Even as he pumps more corrupt cum into you the big imp keeps raping you, forcing you to another peak before you\'ve come down from the last one.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'The thought of all that demon-jism in your womb pushes you over the edge. You cum hard, bucking your hips against the ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' pumping hot cum into your belly. Your eyes roll back in your head and you scream out in ecstasy as thick jets of cum fill your pussy. The imp keeps thrusting into his fuck-toy even as he fills your womb with his cum, forcing you to another peak before you\'ve come down from the last one. The big imp is your master now.', false );
				}
				EngineCore.outputText( '  You nearly black out as the orgasm blasts through you,  shrieking yourself hoarse as the orgasm wracks your body, eyes rolling back in your head as your womb swells.\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'As orgasms wrack your body your breasts pump out even more milk, too much for the imps below to handle. Milk pours down your chest in great streams, soaking the imps and splashing onto the ground below you. The milk gushing through your tender ' + Descriptors.nippleDescript( 0 ) + ' pushes you to another orgasm. You shake your tits as you cum, mooing in mindless pleasure, spraying jets of milk everywhere. Your rider cums, soaking your ' + Descriptors.hairDescript() + ' with jets of imp-jism that run down your scalp and over your cheeks. ', false );
				}
				//(High corruption);
				if( CoC.player.cor >= 50 ) {
					EngineCore.outputText( 'You lap eagerly at the salty cum, licking up and drinking as much as you can.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'Imp-jism rains down on your helpless spasming body. The imps spew cum into your hair, across your back and ' + Descriptors.hipDescript() + ', over your face', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( ', and bouncing ' + CoC.player.allBreastsDescript(), false );
				}
				EngineCore.outputText( '. The ' + CoC.monster.short + ' is no longer holding you down. They masturbate over you as you claw at the ground with your hands, hooves scraping the earth as you clamp your thighs tight around the big imp. Another pulse of demonic cum hits your womb. You push back against your master, forcing as much of his cock into you as possible. Arching your back, your eyes roll back in your head and you moo as your womb stretches painfully, a final orgasm crashing through your cum-bloated body. You spasm around the cock that impales you, thrashing as ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'milk spurts from your ' + Descriptors.nippleDescript( 0 ) + ' and ', false );
				}
				EngineCore.outputText( 'steaming fluids spew from your over-filled pussy. Unconsciousness follows closely on the heels of this last orgasm, your mind shutting down even as your body still shudders.\n\n', false );
				EngineCore.outputText( 'You wake up later, body still twitching as tiny orgasms spark in your ' + Descriptors.vaginaDescript( 0 ) + '. It\'s still dark out. You lie on your side in a pool of cooling cum, milk, and pussy juice. Your body is covered in long ropes of drying imp-cum, and your hair is plastered to the ground. There\'s no sign of the horde of imps or their big master. Your skin is stretched and shiny over your still milk-bloated tits. Your belly is as tight and distended as a mare on the verge of giving birth. It quivers as the flesh of your ' + Descriptors.vaginaDescript( 0 ) + ' spasms. Over the swollen curve of your belly you can see steam rising from between your legs. You start to slip back into unconsciousness. ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'Your last coherent thought is to find a way to better hide your camp, so this never happens again.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'Your last coherent thought is to find a way to make your own mutated master imp, maybe even a stable full of them...', false );
				}
				CoC.player.orgasm();
				EngineCore.dynStats( 'lib', 2, 'cor', 3 );
				CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP - 14 ); //Bigger imp means faster pregnancy
			}
			//Scene number 2 - male possible.;
			else {
				//Scene 2 (Centaur, vaginal);
				if( CoC.player.findStatusAffect( StatusAffects.ImpGangBang ) >= 0 ) {
					//(Subsequent encounters - Low Corruption);
					if( CoC.player.cor < 50 ) {
						EngineCore.outputText( 'You can\'t tell if this is the same ' + CoC.monster.short + ' as last time or not. You\'re not racist, but all imps look alike to you. ' + CoC.monster.getCapitalA() + ' surges forward, grabbing at your legs and arms and running their hands over your body. You struggle, but there are just too many to fight. The result is the same as last time...\n\n', false );
					}
					//(Subsequent encounters - High Corruption);
					else {
						EngineCore.outputText( 'It\'s about time they showed up. It\'s not like there\'s a lot to do in these rocks, and you were getting bored. You grab an imp dick in either hand and spread your legs as other imps grope your thighs...\n\n', false );
					}
				}
				EngineCore.outputText( 'The imp mob tackles you, grabbing at your arms as you ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'swing your ' + CoC.player.weaponName + ' wildly, determined not to let them take you', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'twist and struggle in their grips, determined to make them work for their fun', false );
				}
				EngineCore.outputText( '! You kick back and feel your hooves smash into an imp\'s chest, sending him flying. But the ' + CoC.monster.short + ' has your legs and more imps grab your arms. The pack drags you thrashing and bucking over to an old log lying on the ground.\n\n', false );
				EngineCore.outputText( 'Your human torso is dragged down to the log by ' + CoC.monster.a + ' while two more leap onto your back. The ' + CoC.monster.short + ' makes short work of your ' + CoC.player.armorName + ', unbuckling straps and stripping you quickly. ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'Your unbound ' + Appearance.biggestBreastSizeDescript() + ' bounce out over the weathered log. ', false );
				}
				EngineCore.outputText( 'The imps spread your arms wide, forcing your chest out, and tie them to the log with sweaty loincloths. Your ' + Descriptors.hipDescript() + ' are stuck high in the air. Imps rub their sweaty cocks and ' + CoC.monster.ballsDescriptLight() + ' over your legs and grope your crotch. The two imps riding your back start stroking and licking each other. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'Your face flushes with humiliation as they turn their attentions on each other, each working their hands and tongue over the other\'s dick. How dare these demons use you as a bed to sate their lusts?!', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'Your face flushes with anger as they turn their attentions on each other, each working their hands and tongue over the other\'s dick. You worked hard for this magnificent body, and now they\'re not using it?!', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'An imp quickly climbs up your body, planting his feet on your shoulders and grabbing your ' + Descriptors.hairDescript() + ' with one hand for support. He rubs his ' + CoC.monster.ballsDescriptLight() + ' over your mouth, smearing your lips with musky sweat, while he pries at your jaw with his other hand. ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'An imp mounts the log and slaps his ' + CoC.monster.cockDescriptShort( 0 ) + ' between your ' + CoC.player.allBreastsDescript() + ', squeezing them tight over his cock as he rubs back and forth. He mauls your breasts cruelly, squeezing his fingers deep into your soft flesh.  ', false );
				}
				//(If the player has a SINGLE cock);
				if( CoC.player.cockTotal() === 1 ) {
					EngineCore.outputText( 'An imp ducks under your body and grabs your ' + Descriptors.cockDescript( 0 ) + '. His nimble tongue flicks over your cock-head while he pricks the shaft with his tiny claws.  ', false );
				}
				//(If the player has a MULTI cock);
				if( CoC.player.cockTotal() > 1 ) {
					EngineCore.outputText( 'Two imps duck under your body and seize your ' + Descriptors.multiCockDescriptLight() + ', licking the tips with their inhumanly flexible tongues while they stroke the shafts.  ', false );
				}
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You fight to free your hind legs and buck the imps off your back, while sweaty hands slide over your crotch. You whine through clenched teeth as sharp claws jab at your sensitive flesh.\n\n', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'You writhe in the grasp of the imps, reveling in the sensations as tiny claws and teeth nip at your sensitive crotch. You lick salty musk off the swollen balls dangling above your mouth.\n\n', false );
				}
				EngineCore.outputText( '\n\n', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'The imp fucking your ' + Appearance.biggestBreastSizeDescript() + ' handles your soft flesh roughly, pressing and pulling your tits into a fuck-canal for his demon cock. Other imps slap your ' + CoC.player.allBreastsDescript() + ' and laugh as you cry out.  ', false );
				}
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You whimper as your mistreated flesh stings with dozens of pin-prick scratches and bites, and the ' + CoC.monster.short + ' slaps your chest and flanks. The abuse falls on you from all sides, leaving you with no escape. The imp on your shoulders pries your jaws open, and you gag on his ' + CoC.monster.ballsDescriptLight() + '.', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'You suckle eagerly at the musky balls in your mouth. Abuse falls on you from all sides, imps leaving tiny marks on your skin as they nip and scratch at you. You whimper in delight as tiny hands slap your chest and flanks.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'With a loud sucking sound, the imp pulls his balls out of your mouth. Spit and ball-sweat drip over your cheeks as he repositions himself, bending almost completely over on your shoulders to rub his cock-head against your lips. You nearly choke as pre-cum dribbles into your mouth and runs down the back of your throat. The ' + CoC.monster.cockDescriptShort( 0 ) + ' blocks most of your vision, but in the corners of your eyes you see the master of this imp horde step forward. Four feet tall and broader and stronger than any imp in the pack, with a face as much dog as imp, this new imp has black fur, broad red demon wings, two long demon-horns on his head, and a ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' big enough to choke a minotaur. He leers at your helpless body and grabs ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'one of your sore ' + Appearance.biggestBreastSizeDescript() + ' in his calloused hand, brutally pressing his fingers into your flesh', false );
				}//(If the player doesn't have breasts);
				else {
					EngineCore.outputText( 'your tail and yanks, brutally pulling on it', false );
				}
				EngineCore.outputText( ' until you shriek. The imp riding your shoulders plunges his ' + CoC.monster.cockDescriptShort( 0 ) + ' into your mouth, pounding at the top of your throat.\n\n', false );
				EngineCore.outputText( 'The master imp walks back to your hips, lightly dragging his sharp claws over your flanks. He kicks another imp out of the way and takes position behind your ' + Descriptors.hipDescript() + '. He pulls his monstrously long ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' down and rubs the tip over your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '.  ', false );
				//(If the player has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( 'Pre-cum drips from the broad tip of it, dripping down to the base of your ' + Descriptors.multiCockDescriptLight() + '.  ', false );
				}
				EngineCore.outputText( 'The big imp\'s hot pre-cum stings your flesh. The imps licking your crotch lap up the hot fluid, cooling you with their saliva. The big imp sneers as you whimper, and presses the head of his ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' against your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You try to pull away from the hot cock-head rubbing against your hole, but the ' + CoC.monster.short + ' holds you tight.', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'The scent of musk steaming off the' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' drives you wild, and you push back to try and capture the cock-tip.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'The pointed tip of the master imp\'s ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' plunges into your hole, splitting your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( ' wide open. You moan around the cock fucking your throat as the corrupted wolf-cock pushes deeper into your hole. The painfully hot shaft claims inch after inch of your flesh, forcing its way deeper into you than any normal human could bear. Bound to the log you can only shake in agony as the big imp\'s thick dog-knot hits your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '.', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( '  The imp fucking your aching ' + Appearance.biggestBreastSizeDescript() + ' paints your tits with a massive load of cum. He falls off the log and another imp jumps up to take his place.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'The big imp fucks you roughly, clenching your ' + Descriptors.hipDescript() + ' in his clawed hands as he hammers his ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' into you. The head of his mutated shaft pounds ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( 'the entrance of your womb', false );
				}//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( 'depths of your bowels', false );
				}
				EngineCore.outputText( ' as the knot slams against your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '. Each hard thrust pounds you against the log, and you grunt in time to the shaft pistoning in your hole.\n\n', false );
				EngineCore.outputText( 'The master imp fucks you for what seems like hours, beating his dog-knot against your sore ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( ' and slapping your ass every few thrusts to remind you who is in charge. Imp after imp stretches your throat with their cocks and your belly with demon-seed as the pack rapes your face. ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'The rough fucking shakes your cum-stained breasts, and the imp fucking your ' + CoC.player.allBreastsDescript() + ' clings tightly to your red and swollen tit flesh. Your ' + Appearance.biggestBreastSizeDescript() + ' burn with agony as the ' + CoC.monster.short + ' slaps your tits like drums.  ', false );
				}
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You\'re being raped again by demons, impaled on cocks like a roast pig on a spit, and you can feel your lust rising. This corrupted land has left its mark on you.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'This corrupted land has left its mark on you. You could never have taken a cock this big before you arrived here.', false );
				}
				EngineCore.outputText( '\n\n', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You gurgle helplessly as the cock raping your throat pours thick wads of', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'You eagerly chug thick wads of cum from the cock stretching your throat, working your throat to force more', false );
				}
				EngineCore.outputText( ' cum into your swelling belly. The imp slams his cock as deep into your throat as it will go, slapping his ' + CoC.monster.ballsDescriptLight() + ' against your face. He cums for an impossibly long time, streams of jism pouring into you. You can feel your stomach stretching, but you\'re more worried about breathing. The edge of your vision starts to go red and your chest heaves as you fight for air. Finally the imp draws his cock out of your throat, spraying his last gobs of cum over your face as you gasp in huge lungfuls of air. The sudden rush of oxygen pushes you over the edge and you cum hard. Your hands clench at the air and your eyes roll back in your head as you twist around the demonic ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' pounding into you. You shriek as your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( ' spasms on the steaming pole that impales it. Another imp shoves his cock in your mouth as you scream, throat convulsing around his cock-head.', false );
				//(If the player has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( '  Your ' + Descriptors.multiCockDescriptLight() + ' shoots cum across the ground and into the waiting mouths of the imps licking your crotch.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'Another imp-cock spasms in your throat as its owner rams deep into you. He floods your already swollen stomach with inhuman amounts of cum. Again you feel yourself about to black out as the demon pumps jism into you. He pulls out and again you orgasm as you wheeze for air. Another imp forces his cock down your throat as you moan and gasp. Your body shakes in pleasure on the big imp\'s ' + Appearance.cockNoun( CockTypesEnum.DOG ) + '.  Tightening his grip on your ' + Descriptors.hipDescript() + ' the master imp howls and slams his shaft into your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '. His unnaturally huge knot stretches the entrance of your hole, and he hammers into you again. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You howl around the imp-cock stretching your throat. The bloated knot opens your hole far beyond anything you\'ve endured before. Your violent thrashing throws the imps off your back and you buck uselessly, thrashing as the swollen ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' plunges deeper into you.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'The master imp\'s bloated knot stretches your entrance and plunges into your hole with a loud <i>pop</i>. Another orgasm hits you as the ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' rams even deeper into you. You howl around the imp-cock stretching your throat, bucking as your orgasm shakes you. Your violent thrashing throws the imps off your back and slams your hips against the big imp, pushing him further into your hole.', false );
				}
				EngineCore.outputText( '  The big imp howls again as he cums, each wave of steaming demon-cum stretching his knot and shaft even more. His cum-pumping ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' is bottomed out deep in your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( 'womb', false );
				}//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( 'guts', false );
				}
				EngineCore.outputText( ' and he pumps more jism into you than his balls could possibly hold. Your belly stretches with every blast of cum and you shriek around yet another cock in your throat.\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 2 ) {
					EngineCore.outputText( 'The imp riding your ' + Appearance.biggestBreastSizeDescript() + ' cums, his load lost in the flood of jism dripping off your abused fuck-udders. ', false );
				}
				EngineCore.outputText( 'Your master isn\'t done with you yet, churning his ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' knot in your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( ' as he continues to cum. You\'re pumped full of demon-cum from both ends as one imp shoots his load in your throat and another steps up to take his place. You shake and tremble in your own endless orgasm as the pleasure in your stretched hole blends with the pain of your swollen belly. Your fingers claw at the log as the master imp shifts his massive knot within your monstrously stretched ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '. Your legs give out as you feel more pulses of demon-cum work their way up his shaft and into your already-huge belly.\n\n', false );
				EngineCore.outputText( 'You pass out as another tidal wave of corrupted jism spews into your hole, another load of imp-cum pours down your throat, to meet somewhere in the middle...\n\n', false );
				EngineCore.outputText( 'You wake up later, still trembling with small orgasms. Cum burbles in your mouth as you breathe, and your ' + Descriptors.hairDescript() + ' is soaked with jism. You haven\'t moved since you passed out. Your arms are still tied to the log, ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'your bruised and throbbing tits pressed against the rough wood, ', false );
				}
				EngineCore.outputText( 'and your body rests in a cooling pool of cum. You couldn\'t move even if your ' + CoC.player.legs() + ' felt stronger. Your hideously bloated belly weighs you down, quivering with every orgasmic twitch that passes through you. The skin of your distended belly is drum-tight and shiny. As you slip back into unconsciousness, one last thought flits across your mind. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'How long can you last in this corrupted land, when your body can be so horribly twisted by the sick pleasures of its denizens?', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'Why bother with your silly quest, when you\'ve only scratched the surface of the pleasures this land offers you?\n', false );
				}
				CoC.player.orgasm();
				EngineCore.dynStats( 'lib', 2, 'cor', 3 );
				CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP - 14 ); //Bigger imp means faster pregnancy
				//Stretch!;
				if( CoC.player.hasVagina() ) {
					if( CoC.player.cuntChange( CoC.monster.cockArea( 2 ), true ) ) {
						EngineCore.outputText( '\n', false );
					}
				} else {
					if( CoC.player.buttChange( CoC.monster.cockArea( 2 ), true ) ) {
						EngineCore.outputText( '\n', false );
					}
				}
			}
		}
		//NOT CENTAUR;
		else {
			if( Utils.rand( 2 ) === 0 && (CoC.player.cockTotal() === 0 || CoC.player.gender === 3) ) {
				//(First encounter);
				if( CoC.player.findStatusAffect( StatusAffects.ImpGangBang ) < 0 ) {
					EngineCore.outputText( 'The imps stand anywhere from two to four feet tall, with scrawny builds and tiny demonic wings. Their red and orange skin is dirty, and their dark hair looks greasy. Some are naked, but most are dressed in ragged loincloths that do little to hide their groins. They all have a ' + CoC.monster.cockDescriptShort( 0 ) + ' as long and thick as a man\'s arm, far oversized for their bodies. Watching an imp trip over its ' + CoC.monster.cockDescriptShort( 0 ) + ' would be funny, if you weren\'t surrounded by a horde of leering imps closing in from all sides...\n\n', false );
					CoC.player.createStatusAffect( StatusAffects.ImpGangBang, 0, 0, 0, 0 );
				}
				EngineCore.outputText( 'The imps leap forward just as you start to ready your ' + CoC.player.weaponName + ', one sweaty imp clinging to your arm', false );
				if( CoC.player.weaponName !== 'fists' ) {
					EngineCore.outputText( ' while another kicks your weapon out of reach', false );
				}
				EngineCore.outputText( '. The ' + CoC.monster.short + ' surges forward and grapples you. Imps grope your body and hump their ' + CoC.monster.cockDescriptShort( 0 ) + ' against your legs, smearing their sweat and pre-cum into your ' + CoC.player.skinDesc + '. The rest of the ' + CoC.monster.short + ', a dozen or more imps, all leer at you and laugh as they slap and pinch your body. The imps have sharp claws, tiny sharp teeth, and short horns on their heads. They scratch, claw, and bite at you with all of these weapons as they try to pull you down to the ground. One bold imp leaps forward and grabs your ', false );
				//(If the player has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( Descriptors.cockDescript( 0 ), false );
				} else {
					EngineCore.outputText( Descriptors.nippleDescript( 0 ), false );
				}
				EngineCore.outputText( ', twisting and pinching hard enough to make you yelp in pain. The ' + CoC.monster.short + ' stinks of sweat and pre-cum, and their moist grips and obscene smirks leave you with no doubts about what they will do to you if you lose this fight.\n\n', false );
				//(Bipedal, vaginal);
				EngineCore.outputText( 'The ' + CoC.monster.getCapitalA() + ' overwhelms you, dragging you to the ground with sheer numbers. There are at least two imps on each limb, holding you spread-eagled on the cold ground while other imps stroke your body. ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'Imps surround your chest, slapping their ' + CoC.monster.cockDescriptShort( 0 ) + 's on your ' + CoC.player.allBreastsDescript() + ' and rubbing their slippery pre-cum into your ' + Descriptors.nippleDescript( 0 ) + '.  ', false );
				}
				EngineCore.outputText( 'Others stand over your head, their cocks bobbing inches from your face as they jack off. A thick musk wafts off their cocks, and the smell of it makes your sinuses tingle. Two more imps take position between your legs, sliding their cocks along your thighs while stroking your ' + Descriptors.vaginaDescript( 0 ) + ' and flicking your ' + Descriptors.clitDescript() + '.', false );
				//(If the player has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( 'An imp rubs his hand across his cock-head, smearing it with his pre-cum. He rubs his hand over your ' + Descriptors.multiCockDescriptLight() + ', making your cock-skin tingle as his fluid soaks into you.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'The ' + CoC.monster.short + ' snickers lewdly as your nipples harden and your pussy moistens. One of the imps between your legs slides his shaft along your pussy lips, teasing your ' + Descriptors.clitDescript() + ' with the tip of his cock.  ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You renew your struggles, trying to break free of your captors. They only laugh and bear down harder on you.  ', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'You buck your hips, trying to capture his ' + CoC.monster.cockDescriptShort( 0 ) + ' with your ' + Descriptors.vaginaDescript( 0 ) + '.  ', false );
				}
				EngineCore.outputText( 'Before he can thrust into you, the imp is shoved aside by the biggest imp you\'ve ever seen.\n\n', false );
				EngineCore.outputText( 'Four feet tall and broader and healthier looking than any imp you\'ve seen before, with a face as much bull as imp, this new imp has mottled grey skin, broad purple demon wings, two curving bull-horns on his head, and a ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' big enough to choke a minotaur. The mushroom-like head of it bobs just below his mouth, and his snake-tongue darts out to flick a bit of pre-cum off the head and onto your groin. You shudder as the hot fluid stings the sensitive skin of your ' + Descriptors.vaginaDescript( 0 ), false );
				//(If the player has a dick);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( ' and ' + Descriptors.multiCockDescriptLight(), false );
				}
				EngineCore.outputText( '. His ' + CoC.monster.ballsDescriptLight() + ' are each the size of your fist and slick with sweat. He slaps his sweaty balls against your ' + Descriptors.vaginaDescript( 0 ) + ' nearly scalding you with the heat.  ', false );
				//(Low corruption);
				if( CoC.player.cor < 33 ) {
					EngineCore.outputText( 'You yelp and buck your hips to escape the heat.  ', false );
				}
				EngineCore.outputText( 'He grabs your hips and slowly drags his shaft down your pussy, each ridge of his demonically-hot ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' hitting your clit and pulling at your lips. Finally the broad horse-like head of his shaft catches on your ' + Descriptors.clitDescript() + ', and the hot pre-cum dribbles over your sensitive flesh. The big imp sneers as you whimper, and drags his cock-head down to the opening of your ' + Descriptors.vaginaDescript( 0 ) + '. The other imps watch and stroke themselves as their master pulls his hips back to push into you.\n\n', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You scream for help', false );
				}
				//(High corruption);
				if( CoC.player.cor >= 50 ) {
					EngineCore.outputText( 'You moan with lust', false );
				}
				EngineCore.outputText( ' as the inhumanly hot cock-head stretches your pussy lips, your cries vanishing into the dark skies above. Two imps grab your hair and pull your head up, forcing you to watch as their master pushes his corrupted cock into you. Other imps spread your [legs] even wider, leaving you helpless as the big imp slides his swollen meat into your ' + Descriptors.vaginaDescript( 0 ) + '. You squirm and twist against the imps holding you down as the hot flesh almost burns your sensitive cunt. You can smell the hot sweat steaming off his shaft, and your pussy-fluids start to steam as well as he forces his cock-head into your ' + Descriptors.vaginaDescript( 0 ) + '. His huge cock-head bulges your groin, and you watch ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'in helpless terror as the bulge inches up from the base of your groin towards your stomach. You let out a shuddering moan of pain as inch after inch of monstrous ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' stretches your belly', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'panting in lust as the monstrous ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' pushes your flesh aside to make room for itself', false );
				}
				EngineCore.outputText( '. ', false );
				//(This is a good place for the virginity-loss message, if needed);
				CoC.player.cuntChange( CoC.monster.cockArea( 1 ), true );
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'You can feel every ridge and pulsing vein of his cock pulling on the lining of your stretched cunt. You tremble helplessly around the huge shaft, fully impaled on the imp\'s mutated bull-cock.\n\n', false );
				EngineCore.outputText( 'Every pulse of his heart makes his cock twitch, making you shake in time to the shaft pulsing in your cunt. The imps jeer at you, masturbating over your shaking body. The big imp flexes his thighs, and the bulge of his cock-head bounces high in your belly. The other imps laugh as you ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'whimper, spasming as the hot shaft presses against new areas', false );
				}
				//High corruption);
				else {
					EngineCore.outputText( 'moan in pleasure, rotating your hips around this incredible cock', false );
				}
				EngineCore.outputText( ' in your stuffed ' + Descriptors.vaginaDescript( 0 ) + '. The big imp sneers and bounces his cock again, watching ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() >= 3 ) {
					EngineCore.outputText( 'your ' + CoC.player.allBreastsDescript() + ' roll on your chest as you squirm', false );
				}//(If the character doesn't have breasts);
				else {
					EngineCore.outputText( 'your eyes roll back as you squirm', false );
				}
				EngineCore.outputText( '.  ', false );
				//(If the character has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' slaps against your distended belly as you shake.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'Finally the big imp pulls back his ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ', each ridge pulling on your pussy flesh as he slides out. An imp reaches out and slaps the bulge as it withdraws, making you yelp and buck.  ', false );
				//(If the character has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' bounces as the bulge passes under it.  ', false );
				}
				EngineCore.outputText( 'You moan as the mushroom-head reaches the entrance of your ' + Descriptors.vaginaDescript( 0 ) + ', your stretched pussy-flesh slowly returning to normal. The master imp pushes forward again, reclaiming your pussy for his monstrous cock. ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You try to pull your hips back, fighting to break free as the bulge of his cock-head works its way high up into your belly. You\'re held down by too many imps. You can only writhe around the hot shaft stretching out your ' + Descriptors.vaginaDescript( 0 ) + '. Your head is held steady by two imps, you can\'t even look away as their master rapes you. The big imp grunts as his cock-head pops past your cervix, and you moan and shake in pain.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'You moan in ecstasy as the hot ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' pushes deep into your ' + Descriptors.vaginaDescript( 0 ) + ', turning every inch of your pussy into a pleasure-sheath for the big imp. You know you\'re nothing but a fuck-toy for this corrupt creature, just a wet pussy for him to fill with cum, and the thought almost makes you orgasm as he forces his huge cock-head past your cervix.', false );
				}
				EngineCore.outputText( 'Finally the corrupt cock bottoms out against your womb. The imp pulls back again, and starts to fuck you slowly.\n\n', false );
				EngineCore.outputText( 'The big imp grinds his hips as he thrusts and pulls, rubbing his cock-ridges against every part of your ' + Descriptors.vaginaDescript( 0 ) + '.  While sliding his mutated ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' in and out of you the imp rubs his hands along your mound, pulling it open or forcing it tight as he takes you. Your pussy juices steam off his cock as he pumps, and hot pre-cum dribbles down your crack to your ' + Descriptors.assholeDescript() + '. ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'The pain as this huge cock stretches you is overwhelming, but every thrust rubs more corrupted pre-cum into your pussy walls. You start to pant as the imp rapes you, using your body for his own pleasure. Your nipples swell as the heat of his pre-cum soaks through your body. The huge shaft forces your ' + Descriptors.clitDescript() + ' out, and the steaming fluids splashing on it make it tingle almost painfully. Your whimpers and moans of pain start to take on a different tone, and the master imp starts to fuck you faster.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'Pain and pleasure blend into one as the huge ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' stretches you, rubbing pre-cum into steaming pussy. You moan as the big imp fucks you, turning you into a mindless fuck-puppet. Your ' + Descriptors.clitDescript() + ' swells painfully as hot juices splash over it. Your ' + Descriptors.nippleDescript( 0 ) + ' tingle almost painfully as the heat of his pre-cum spreads through your body.', false );
				}
				EngineCore.outputText( '\n\n', false );
				EngineCore.outputText( 'The other imps continue to jerk-off over you as the big imp impales you again and again on his shaft. Their pre-cum starts to splatter down on your body, and they pant as they watch you build towards your orgasm.  ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() >= 3 ) {
					EngineCore.outputText( 'Your ' + CoC.player.allBreastsDescript() + ' bounce and jiggle back and forth as the master imp roughly fucks you.  ', false );
				}
				//(If the character has a dick);
				if( CoC.player.totalCocks() > 0 ) {
					EngineCore.outputText( 'Your ' + Descriptors.multiCockDescriptLight() + ' swell painfully as the rough fucking pumps blood into your groin.  ', false );
				}
				EngineCore.outputText( 'The big imp\'s snake tongue lashes out to incredible length and wraps around one of your ' + Descriptors.nippleDescript( 0 ) + 's, pulling at it and stretching the flesh under it. He moves his tongue back and forth between your nipples, alternating between stretching and flicking them. ', false );
				//(If the character has a dick);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( 'He draws his tongue back and wraps it around your ' + Descriptors.cockDescript( 0 ) + ', sliding its length along your shaft and flicking his tongue over your cock-head.', false );
				}//(If the character doesn't have a dick);
				else {
					EngineCore.outputText( 'His tongue flicks down to your ' + Descriptors.clitDescript() + ', the split ends of it teasing your clit.', false );
				}
				EngineCore.outputText( '  You gasp in time to the big imp\'s thrusts, whimpering when his cock or tongue hit a sensitive point.  ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You\'re being raped by a demon, forced to take an inhuman cock, and you\'re about to cum hard. This corrupted land has left its mark on you.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'This corrupted land has left its mark on you. You could never have taken a cock this big before you arrived here.', false );
				}
				EngineCore.outputText( '  You moan as you rise towards your orgasm.\n\n', false );
				EngineCore.outputText( 'The master imp pounds at you as hard as he can, driving his ' + CoC.monster.cockDescriptShort( 1 ) + ' deeper into you. His grunts come closer and closer together. Your head still held up, you watch as the imps around you start to cum. They spray your body with thick globs of cum, splattering it across your belly', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() >= 3 ) {
					EngineCore.outputText( ' and ' + CoC.player.allBreastsDescript(), false );
				}
				EngineCore.outputText( '. The master imp pounds into you and you can see his ' + CoC.monster.ballsDescriptLight() + ' swell. Through the haze of your approaching orgasm you realize what\'s about to happen. Those oversized balls are about to pump more cum into you than any normal man could ever produce. They\'re going to pump demonic cum right into your womb.  ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You scream as the base of his ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' bloats with corrupted jism, the thick bulge stretching your pussy even more as it pumps along the imp\'s shaft. The bulge swells your belly and you watch as it moves towards your womb. Another thick bulge forms at the base of the master imp\'s cock and you thrash wildly, yelling in protest. "<i>NOO - O - O - OOOOHhh!</i>" The hot cum floods into your womb and you hit your own orgasm, shaking as your ' + Descriptors.vaginaDescript( 0 ) + ' clamps down on his cock and milks it of waves of cum. Another orgasm hits on the heels of the first one, and you buck as more demon-cum floods your womb. Gasping for air, you continue to come as your belly swells. Even as he pumps more corrupt cum into you the big imp keeps raping you, forcing you to another peak before you\'ve come down from the last one.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'The thought of all that demon-jism in your womb pushes you over the edge. You cum hard, bucking your hips against the ' + Appearance.cockNoun( CockTypesEnum.HORSE ) + ' pumping hot cum into your belly. Your eyes roll back in your head and you scream out your ecstasy as thick jets of cum fill your pussy. The imp keeps thrusting into his fuck-toy even as he fills your womb with his cum, forcing you to another peak before you\'ve come down from the last one. The big imp is your master now.', false );
				}
				EngineCore.outputText( '  You nearly black out as the orgasm blasts through you,  arching your back off the ground as the orgasm wracks your body, eyes rolling back in your head as your womb swells.\n\n', false );
				EngineCore.outputText( 'Imp-jism rains down on your helpless spasming body. The imps spew cum into your hair, across your swollen belly, over your face', false );
				//(If the character has a cock) ;
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( ', and cum-dripping ' + Descriptors.cockDescript( 0 ), false );
				}
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() >= 3 ) {
					EngineCore.outputText( ', and bouncing ' + CoC.player.allBreastsDescript(), false );
				}
				EngineCore.outputText( '. The ' + CoC.monster.short + ' is no longer holding you down. They masturbate over you as you claw at the ground with your hands, toes curling as you clamp your thighs tight around the big imp. Another pulse of demonic cum hits your womb. You wrap your legs around your master, forcing as much of his cock into you as possible. Arching your back, your eyes roll back in your head and you shriek as your womb stretches painfully, a final orgasm crashing through your cum-bloated body. You spasm around the cock that impales you, thrashing against the ground as ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() >= 3 && CoC.player.biggestLactation() > 1 ) {
					EngineCore.outputText( 'milk spurts from your ' + Descriptors.nippleDescript( 0 ) + ' and ', false );
				}
				EngineCore.outputText( 'steaming fluids spew from your over-filled pussy. Unconsciousness follows close on the heels of this last orgasm, your mind shutting down even as your body still shudders.\n\n', false );
				EngineCore.outputText( 'You wake up later, body still twitching as tiny orgasms spark in your ' + Descriptors.vaginaDescript( 0 ) + '. It\'s still dark out. You lie in a pool of cooling cum and pussy juice. Your body is covered in long ropes of drying imp-cum, and your hair is plastered to the ground. There\'s no sign of the horde of imps or their big master. Your belly is as tight and distended as a woman on the verge of giving birth. It quivers as the flesh of your ' + Descriptors.vaginaDescript( 0 ) + ' spasms. Over the swollen curve of your belly you can see steam rising from between your legs. You start to slip back into unconsciousness. ', false );
				//(Low corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'Your last coherent thought is to find a way to better hide your camp, so this never happens again.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'Your last coherent thought is to find a way to make your own mutated master imp, one you can keep as a fuck-toy...', false );
				}
				CoC.player.orgasm();
				EngineCore.dynStats( 'lib', 2, 'cor', 3 );
				CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP - 14 ); //Bigger imp means faster pregnancy
			} else {
				//Imp Scene 2 (Bipedal, vaginal);
				//Tag-team;
				//Include milking alt text in separate blocks. ;
				//Work cock and multicock alt text directly into main text blocks.;
				if( CoC.player.findStatusAffect( StatusAffects.ImpGangBang ) >= 0 ) {
					//(Subsequent encounters - Low Corruption);
					if( CoC.player.cor < 50 ) {
						EngineCore.outputText( 'You can\'t tell if this is the same ' + CoC.monster.short + ' as last time or not - all imps look alike to you.  The ' + CoC.monster.getCapitalA() + ' surges forward, grabbing at your ' + CoC.player.legs() + ' and arms and running their hands over your body. You struggle, but there are just too many to fight. The result is the same as last time...\n\n', false );
					}
					//(Subsequent encounters - High Corruption);
					else {
						EngineCore.outputText( 'It\'s about time they showed up. It\'s not like there\'s a lot to do in these rocks, and you were getting bored. You grab an imp dick in either hand and spread your legs as other imps grope your thighs...\n\n', false );
					}
				}
				EngineCore.outputText( 'The ' + CoC.monster.getCapitalA() + ' swarms over you, dragging you to the ground as ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'you punch and kick wildly, determined not to let them take you', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'you twist and struggle in their grips, determined to make them work for their fun', false );
				}
				EngineCore.outputText( '! They pull you down over a fallen log, ass resting above your head. Two imps sit on your arms, their gonads rubbing against your biceps, and rub their hands over your shoulders and chest. Others stretch your ' );
				if( CoC.player.isNaga() ) {
					EngineCore.outputText( 'coils out, twisting them around a log to hold you still.\n\n' );
				} else {
					EngineCore.outputText( CoC.player.legs() + ' wide apart, holding them against the log.\n\n', false );
				}

				EngineCore.outputText( 'The ' + CoC.monster.short + ' makes short work of your ' + CoC.player.armorName + ', unbuckling straps and stripping you quickly. ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'An imp mounts your chest and slaps his ' + CoC.monster.cockDescriptShort( 0 ) + ' between your ' + CoC.player.allBreastsDescript() + ', squeezing them tight over his cock as he rubs back and forth.  ', false );
				}
				//(If the player has a SINGLE cock);
				if( CoC.player.cockTotal() === 1 ) {
					EngineCore.outputText( 'Your ' + Descriptors.cockDescript( 0 ) + ' is seized by an imp, who licks the tip with his inhumanly nimble tongue while he strokes the shaft.  ', false );
				}
				//(If the player has a MULTI cock);
				if( CoC.player.cockTotal() > 1 ) {
					EngineCore.outputText( 'Two imps seize your ' + Descriptors.multiCockDescriptLight() + ', licking the tips with their inhumanly nimble tongues while they stroke the shafts.  ', false );
				}
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You fight to free your arms and shake the imp off your chest while tiny hands slide over your face. They tug at your lips and try to pry your jaws open', false );
				}
				//High Corruption);
				else {
					EngineCore.outputText( 'You writhe in the grasp of the imps, reveling in the sensations of being spread open and completely at the mercy of these demons. Tiny hands slide over your face and you lick and suck at the fingers', false );
				}
				EngineCore.outputText( '.\n\n', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'Hands slide over your ' + CoC.player.allBreastsDescript() + ', pinching and pulling at your nipples. The imp riding your ' + Appearance.biggestBreastSizeDescript() + ' licks your tit-flesh, slowly working his tongue up towards your ' + Descriptors.nippleDescript( 0 ) + '. Finally the imp\'s tongue reaches your nipple, wrapping around and pulling at the tingling flesh. ', false );
					//(Low Corruption);
					if( CoC.player.cor < 50 ) {
						EngineCore.outputText( 'You can\'t escape the tongue lapping and pulling at your ' + Descriptors.nippleDescript( 0 ) + '. You shake your head to deny the pleasure, but your breathing comes faster and faster as lust invades your body.', false );
					}
					//(High Corruption);
					else {
						EngineCore.outputText( 'The tongue squeezing and tugging your nipple floods your body with lust. You moan and arch your back, offering your tits to the imp riding your chest. You can hear your pulse pounding in your ears as you pant in desire.', false );
					}
					EngineCore.outputText( '  Suddenly you feel tiny needle-sharp teeth pierce your nipple. You scream as venom pumps into your tits, red-hot poison that makes your ' + CoC.player.allBreastsDescript() + ' feel as though they were being stung by bees. You moan in pain as your breasts start to swell, the imp rider biting into your other nipple to pump demon-taint into it.', false );
					if( CoC.player.hasFuckableNipples() ) {
						EngineCore.outputText( 'With the imp\'s taint seeping into your ' + Descriptors.nippleDescript( 0 ) + ', each one\'s cunt-like shape begins swelling. The fuckable orifices engorge into larger and fatter looking labia, becoming fuller cunts each with an engorged clitoral nub the size of a golf ball. Their color deepens as the skin of your nipple-cunts becomes tighter and smoother.  The imp giggles and continues nibbling the newly swollen sensitive flesh, injecting further doses of venom.', false );
					}
					EngineCore.outputText( '\n\n', false );
					//Grow tits!;
					CoC.player.growTits( 2, CoC.player.breastRows.length, false, 1 );
					CoC.player.boostLactation( 0.5 );
				}
				EngineCore.outputText( 'The master of this ' + CoC.monster.short + ' steps up ' );
				if( CoC.player.isNaga() ) {
					EngineCore.outputText( 'alongside your taut tail' );
				} else {
					EngineCore.outputText( 'between your ' + CoC.player.legs() );
				}
				EngineCore.outputText( ', leering down at your trapped body. Four feet tall and broader and stronger than any imp in the pack, with a face as much dog as imp, this new imp has grey fur, broad black demon wings, two long demon-horns on his head, and a ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' big enough to choke a minotaur. Pre-cum drips from the broad tip of it, dripping down onto your ', false );
				//(If the player has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( Descriptors.multiCockDescriptLight(), false );
				}//(If the player doesn't have a cock);
				else {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				EngineCore.outputText( '.  ', false );
				EngineCore.outputText( 'The heat stings your flesh. The imps licking your groin lap up the hot fluid, cooling you with their saliva. The big imp sneers as you whimper, and drags the head of his ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' down to your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '.  He thrusts brutally, shoving the head of his ' + CoC.monster.cockDescriptShort( 2 ) + ' into your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina)" + ;
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You screech in agony as the big imp forces his mutated wolf-cock into your hole, brutally shoving thick inch after inch of painfully hot ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' deeper into you than anything should ever go.  ', false );
				}
				//(High Corruption);
				else {
					EngineCore.outputText( 'The master imp\'s painfully hot ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' stretches your hole wider than it ever should be, and you moan in perverse ecstasy.  ', false );
				}
				EngineCore.outputText( 'His huge dick-knot bumps against the entrance of your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '.\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'The big imp reaches past your tit-rider and grabs one of your painfully distended breasts in each hand, mauling and bouncing the flesh as if weighing them. You gasp in pain as your ' + CoC.player.allBreastsDescript() + ' swell further at his touch.  ', false );
				}
				EngineCore.outputText( 'Your mouth gapes open and an imp takes the chance to stuff it full of cock.  ', false );
				EngineCore.outputText( 'The master imp grabs your hips and starts to fuck you hard, pistoning his steaming cock in and out of your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '. ', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 1 ) {
					EngineCore.outputText( 'The rough fucking shakes your breasts, and the imp sucking your nipples clings tightly to your monstrously swollen ' + CoC.player.allBreastsDescript() + '. Your ' + Appearance.biggestBreastSizeDescript() + ' have grown three cup sizes since the imp pumped his venom into you.  ', false );
				}
				EngineCore.outputText( 'The imp fucking your face grabs your ' + Descriptors.hairDescript() + ' and jaw, forcing your head back so he can ram his cock into your throat. The obscene bulge sliding in your throat matches the bulge in your belly. The smaller imp pulls back just enough to let you gasp for air, then thrusts into your throat again. The big imp pounds the knot of his ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' against your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( ', not caring that he\'s stretching you beyond normal human endurance. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You\'re being raped again by demons, impaled on cocks like a roast pig on a spit, and you can feel your lust rising.  This corrupted land has left its mark on you.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'This corrupted land has left its mark on you. You could never have taken a cock this big before you arrived here.', false );
				}
				EngineCore.outputText( '\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'An ache starts deep in the base of your tits and works its way to your sore ' + Descriptors.nippleDescript( 0 ) + '. Your already bloated nipples swell as your rider suckles and you gasp as the first rush of milk spills into his mouth. Your rider milks your udders, moving his hands between your ' + CoC.player.allBreastsDescript() + ' and forcing out more milk than he could ever drink. Other imps lick the milk from the shiny skin of your swollen breasts.\n\n', false );
				}
				EngineCore.outputText( 'The smaller imp slams his cock as deep into your throat as it will go, slapping his ' + CoC.monster.ballsDescriptLight() + ' against your face. He cums, balls twitching as they pump spunk down your throat. You can feel your stomach stretching, but you\'re more worried about breathing. The imp cums for an impossibly long time, streams of jism pouring into you. The edge of your vision starts to go red and your chest heaves as you fight for air. Finally the imp draws his cock out of your throat, spraying his last gobs of cum over your face as you gasp in huge lungfuls of air. The sudden rush of oxygen pushes you over the edge and you cum hard. Your body arches and your eyes roll back in your head as you twist around the demonic ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' pounding into you. You shriek as your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( ' spasms on the steaming pole that impales it. Another imp shoves his cock in your mouth as you scream, throat convulsing around his cock-head.', false );
				//(If the player has a cock);
				if( CoC.player.cockTotal() > 0 ) {
					EngineCore.outputText( '  Your ' + Descriptors.multiCockDescriptLight() + ' shoots cum across your belly and into the waiting mouths of the imps licking your crotch.', false );
				}
				EngineCore.outputText( '\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'Imps lick milk from your bloated ' + Appearance.biggestBreastSizeDescript() + ' as your rider milks you.  As one imp drinks his fill, staggering away with a sloshing belly, another steps up to guzzle from your milk-spewing udders.\n\n', false );
					//Additional nipplefucking scene by Xodin;
					if( CoC.player.hasFuckableNipples() ) {
						EngineCore.outputText( 'The imp rider grabs the fat folds of one of your nipplecunt\'s \'labia\' and grins mischeviously. He rubs his obscene erection all over the milk stained surface of your nipple-cunt\'s clit and begins to press the head of his bulbous imp cock into the swollen orifice against the flow of milk. You know no woman in your village could have handled an aroused cock this big, and yet now this imp on your ' + CoC.player.allBreastsDescript() + ' is about to ram just such an erection into one of your ' + Descriptors.nippleDescript( 0 ) + 's. He tugs and pulls and pulls again on your nipple-cunt\'s sensitive labia, forcing his cock to push into the flesh of your ' + Appearance.biggestBreastSizeDescript() + '. Your taut flesh burns with his venom already, and is now violated by the presence of his demonic flesh rod.  ', false );
						//[START BREAST SIZE SPECIFIC TEXT] ;
						//[IF breastSize <= DD];
						if( CoC.player.biggestTitSize() <= 5 ) {
							EngineCore.outputText( 'You feel the bulbous head of his cock squeeze further and deeper until it pushes up against your ribs.', false );
						}//[ELSE IF breastSize > DD];
						else {
							EngineCore.outputText( 'You feel the unnaturally large erection spear the fat filled depths of your ' + Appearance.biggestBreastSizeDescript() + ' until at last the imp has shoved himself in to his hilt. He smiles at the sensation of having his manhood completely engulfed in your ' + Appearance.biggestBreastSizeDescript() + '.', false );
						}
						//[END BREAST SIZE SPECIFIC TEXT];
						EngineCore.outputText( '  Back and forth he begins fucking your tit as if it were a regular pussy, and it occurs to you that such a description isn\'t far from the truth. You gasp in pleasure as a strange kind of minor orgasm ripples through your tit and the taut skin of your mammary feels tighter as the ' + Appearance.biggestBreastSizeDescript() + ' momentarily spasms around the imp\'s manhood. The horny little demon slaps your nipplecunt\'s clit in gleeful victory and jumps to the next breast to repeat his lewd fucking on a fresh hole.', false );
						EngineCore.outputText( '\n\n', false );
					}
				}
				EngineCore.outputText( 'The imp-cock in your throat spasms and its owner rams as deep into you as he can get. He floods your already swollen stomach with inhuman amounts of cum. Again you feel yourself about to black out as the demon pumps jism into you. He pulls out and again you orgasm as you wheeze for air. Another imp forces his cock down your throat as you moan and gasp. Your body shakes in pleasure on the big imp\'s ' + Appearance.cockNoun( CockTypesEnum.DOG ) + '.  Tightening his grip on your ' + Descriptors.hipDescript() + ' the master imp howls and slams his shaft into your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}//If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '. His unnaturally huge knot stretches the entrance of your hole, and he hammers into you again. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'You howl around the imp-cock stretching your throat. The bloated knot opens your hole far beyond anything you\'ve endured before. Your violent thrashing throws the imps off your ' + CoC.player.legs() + ' and you kick uselessly, thrashing and bucking as the swollen ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' plunges deeper into you.', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'The master imp\'s bloated knot stretches your entrance and plunges into your hole with a loud <i>pop</i>. Another orgasm hits you as the ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' rams even deeper into you. You howl around the imp-cock stretching your throat, thrashing and bucking as your orgasm shakes you. Your violent thrashing throws the imps off your legs and you wrap your legs around the big imp, pulling him further into your hole.', false );
				}
				EngineCore.outputText( ' The big imp howls again as he cums, each wave of steaming demon-cum stretching his knot and shaft even more. His cum-pumping ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' is bottomed out deep in your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( 'womb', false );
				}//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( 'guts', false );
				}
				EngineCore.outputText( ' and he pumps more jism into you than his balls could possibly hold. Your belly stretches with every blast of cum and you shriek around yet another cock in your throat.\n\n', false );
				//(If the character has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'The imp riding your ' + Appearance.biggestBreastSizeDescript() + ' finally cums, painting your distended fuck-udders with his massive load.  ', false );
				}
				EngineCore.outputText( 'Your master isn\'t done with you yet, churning his ' + Appearance.cockNoun( CockTypesEnum.DOG ) + ' knot in your ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( ' as he continues to cum. You\'re pumped full of demon-cum from both ends as one imp shoots his load in your throat and another steps up to take his place. You shake and tremble in your own endless orgasm as the pleasure in your stretched hole blends with the pain of your swollen belly. Your ' + CoC.player.legs() + ' thrash as the master imp shifts his massive knot within your monstrously stretched ', false );
				//(If the player has a vagina);
				if( CoC.player.hasVagina() ) {
					EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
				}
				//(If the player doesn't have a vagina);
				else {
					EngineCore.outputText( Descriptors.assholeDescript(), false );
				}
				EngineCore.outputText( '. Your toes curl as you feel more pulses of demon-cum work their way up his shaft and into your already-huge belly.\n\n', false );
				EngineCore.outputText( 'You pass out as another load of imp-cum pours down your throat, another tidal wave of corrupted jism spews into your hole, to meet somewhere in the middle...\n\n', false );
				EngineCore.outputText( 'You wake up later, still trembling with small orgasms. Cum burbles in your mouth as you breathe. You haven\'t moved since you passed out. Your hips are still propped up over the log, and you rest in a cooling pool of cum, your ' + Descriptors.hairDescript() + ' plastered to the ground with drying jism. You couldn\'t move even if your ' + CoC.player.legs() + ' felt stronger. Your hideously bloated belly weighs you down, ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 0 ) {
					EngineCore.outputText( 'and your milk-filled udders are still swollen with imp-venom, ', false );
				}
				EngineCore.outputText( 'quivering with every orgasmic twitch that passes through you. The skin of your distended belly ', false );
				//(If the player has breasts);
				if( CoC.player.biggestTitSize() > 3 ) {
					EngineCore.outputText( 'and massive tits ', false );
				}
				EngineCore.outputText( 'is drum-tight and shiny, and your belly-button has popped out into an outie. As you slip back into unconsciousness, one last thought flits across your mind. ', false );
				//(Low Corruption);
				if( CoC.player.cor < 50 ) {
					EngineCore.outputText( 'How long can you last in this corrupted land, when your body can be so horribly twisted for the sick pleasures of its denizens?\n\n', false );
				}
				//(High corruption);
				else {
					EngineCore.outputText( 'Why bother with your silly quest, when you\'ve only scratched the surface of the pleasures this land offers you?\n\n', false );
				}
				CoC.player.orgasm();
				EngineCore.dynStats( 'lib', 2, 'cor', 3 );
				CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP - 14 ); //Bigger imp means faster pregnancy
				//Stretch!;
				if( CoC.player.hasVagina() ) {
					if( CoC.player.cuntChange( CoC.monster.cockArea( 2 ), true ) ) {
						EngineCore.outputText( '\n', false );
					}
				} else {
					if( CoC.player.buttChange( CoC.monster.cockArea( 2 ), true ) ) {
						EngineCore.outputText( '\n', false );
					}
				}
			}
		}
		EngineCore.doNext( MainView.playerMenu );
	};
	ImpScene.prototype.impRapesYou = function() {
		EngineCore.outputText( '', true );
		if( (CoC.player.findPerk( PerkLib.BimboBrains ) >= 0 || CoC.player.findPerk( PerkLib.FutaFaculties ) >= 0) && !CoC.player.isTaur() && CoC.player.hasVagina() ) {
			EngineCore.outputText( ImageManager.showImage( 'imp-loss-female-fuck' ), false );
			EngineCore.outputText( 'You sink to the ground, assuming a position that feels all too natural to you now, leaning forward to let your ' + CoC.player.allBreastsDescript() + ' hang down slightly. The imp looks you up and down, wickedly eyeing your ready, slightly open lips. He drops his loin-cloth to reveal a hardening cock. Your eyes bulge as it grows larger... and larger... and larger! The imp\'s cock finally bulges to a full twelve inches... and it\'s moving closer. You struggle to think... but you just can\'t! You want that in your mouth, like, so bad!\n\n', false );
			EngineCore.outputText( 'Your ' + Descriptors.vaginaDescript( 0 ) + ' drips in anticipation, and you find yourself involuntarily moving your knees farther apart to prepare yourself to be filled. He smiles and presses his cock against your ' + Descriptors.vaginaDescript( 0 ) + ', pushing you back to get a better angle. You try to make words, but your brain can only think of so much at once! Right now, it\'s thinking of cock, which, naturally, makes you open your mouth and let out a slutty moan.\n\n', false );
			EngineCore.outputText( 'The imp pushes into you violently, ramming his cock in to the hilt, leaving you gasping in pain and surprise. He leaves it in your slutty pussy, giving you a second to... oh who is he kidding... he can tell by your air-headed look that you\'ve done nothing but take cocks your whole life. He fucks you hard, slapping your ' + Descriptors.buttDescript() + ' to remind you who is in charge. You can\'t help but think about, like, how you just love it when a man takes charge. Less thinking!', false );
			CoC.player.cuntChange( 12, true, true, false );
			EngineCore.outputText( '\n\n', false );
			EngineCore.outputText( 'The rough fucking becomes more and more pleasurable as time goes on. You moan air-headedly with each thrust, hips squeezing around the demon-cock- loving the feeling of his fullness. Before long you can\'t help but cum all over him, your vagina locking around his cock like a vice, muscles rippling, milking him for his cum. The imp\'s prick explodes inside you, pumping huge loads of hot demon-seed inside you with each eruption. You swoon, feeling it fill your womb and distend your belly as the imp\'s orgasm fills you with insane amounts of cum.\n\n', false );
			EngineCore.outputText( 'With a sigh, he pulls his dick free, and you flop down, cum leaking out onto the ground from your well-fucked hole. If you could, like, focus at all, you\'d totally be worrying about being, like, pregnant or whatever. But you lose consciousness.', false );
			CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP - 14 ); //Bigger imp means faster pregnancy
			CoC.player.orgasm();
			EngineCore.dynStats( 'lib', 1, 'sen', 1, 'cor', 1 );
			Combat.cleanupAfterCombat();
			return;
		}
		//Lust loss;
		if( CoC.player.lust >= 100 ) {
			//50% chance of sprocket rape for super-thick people. ;
			if( CoC.player.cocks.length >= 1 && Utils.rand( 2 ) === 0 ) {
				if( CoC.player.cocks[ 0 ].cockThickness >= 4 ) {
					this.sprocketImp();
					return;
				}
			}
			//Female or Futa;
			if( CoC.player.gender === 2 || CoC.player.gender === 3 ) {
				CoC.player.slimeFeed();
				EngineCore.outputText( ImageManager.showImage( 'imp-loss-female-fuck' ), false );
				EngineCore.outputText( 'You sink to the ground, too overcome by lust and desire to fight.  The imp smiles, a wicked look glinting in his eyes.  He drops his loincloth to reveal a hardening cock.  Your eyes bulge a bit as it grows...and grows...and grows!  That imp has a twelve inch cock..and he\'s walking towards you.   Your ' + Descriptors.vaginaDescript( 0 ) + ' practically juices itself in anticipation, and you find yourself spreading your ' + CoC.player.legs() + ' in preparation.', false );
				EngineCore.outputText( '\n\nHe smiles and presses his cock against your ' + Descriptors.vaginaDescript( 0 ) + '.  Your lust-driven mind is speechless, leaving you panting and moaning like a whore.', false );
				//If too big, only partly penetrate.;
				if( CoC.player.vaginalCapacity() < CoC.monster.cockArea( 0 ) ) {
					if( CoC.player.vaginas[ 0 ].virgin ) {
						EngineCore.outputText( '  He plunges in hard, breaking your hymen and stealing your virginity.  A look of surprise crosses his face, chased away by ecstasy.  If you had a rational bit left in your mind, you\'d notice he looks... stronger somehow, but you\'re too horny to care.', false );
						CoC.player.vaginas[ 0 ].virgin = false;
					} else {
						EngineCore.outputText( '  He pushes against your tight little pussy, struggling to penetrate you.', false );
					}
					EngineCore.outputText( '  His cock only sinks a few inches in, but he begins fucking you hard, each time claiming a bit more of your pussy for his demonic tool.  You feel a painful stretching as he gets half of it inside you, ruining your ' + Descriptors.vaginaDescript( 0 ) + ' for most humans.  He fucks you like this for what seems like forever, never getting much further. ', false );
					CoC.player.cuntChange( CoC.monster.cockArea( 0 ), true );
				} else {
					EngineCore.outputText( '  He plunges in violently, ramming his ' + CoC.monster.cockDescriptShort( 0 ) + ' in to the hilt, leaving you gasping in pain and surprise.  He leaves it there, giving you a second to get used to him, and then begins fucking you hard, slapping your ass every few thrusts to remind you who is in charge.', false );
					CoC.player.cuntChange( 12, true, true, false );
				}
				if( CoC.player.gender === 3 ) {
					EngineCore.outputText( '\n\nThe rough fucking becomes more and more pleasurable as time passes, until you cannot help but stroke your ' + Descriptors.cockDescript( 0 ) + ' along with each plunge he takes in your ' + Descriptors.vaginaDescript( 0 ) + '.  You feel yourself clench around him as your sexual organs release, erupting spurts of cum and milking the demon\'s cock like your life depended on it.', false );
				}
				if( CoC.player.gender === 2 ) {
					EngineCore.outputText( '\n\nThe rough fucking becomes more and more pleasurable as time passes.  You moan loudly and lewdly with each thrust, hips squeezing around the demon-cock, relishing the feeling of fullness.  Before long you cannot help but cum all over him, ' + Descriptors.vaginaDescript( 0 ) + ' locking around his cock like a vice, muscles rippling, milking him for his cum.', false );
				}
				EngineCore.outputText( '  The imp\'s ' + CoC.monster.cockDescriptShort( 0 ) + ' explodes inside you, pumping huge loads of hot demon-seed inside you with each eruption.  You swoon, feeling it fill your womb and distend your belly as the imp\'s orgasm fills you with an unnatural quantity of corrupted semen.\n\nWith a sigh, he pulls his dick free, and you flop back on your back, cum surging out onto the ground from your well-fucked hole.  ', false );
				if( CoC.player.pregnancyIncubation > 0 && CoC.player.pregnancyIncubation <= 216 ) {
					EngineCore.outputText( 'You wonder what this will do to whatever is growing in your womb...  ', false );
				} else {
					if( CoC.player.inHeat ) {
						EngineCore.outputText( 'You find yourself hoping you\'re pregnant as you swiftly lose consciousness.', false );
					} else if( CoC.player.pregnancyIncubation <= 0 ) {
						if( CoC.player.cor > 75 ) {
							EngineCore.outputText( 'With an appreciative moan, you bury your fingers in its slimy warmth, hoping you are pregnant with some fiendish offspring, and lose consciousness.', false );
						} else {
							EngineCore.outputText( 'You hope you don\'t become pregnant, but promptly lose consciousness before you can contemplate the prospect any further.', false );
						}
					}
				}
				CoC.player.knockUp( PregnancyStore.PREGNANCY_IMP, PregnancyStore.INCUBATION_IMP - 14 ); //Bigger imp means faster pregnancy
				EngineCore.dynStats( 'lib', 1, 'sen', 1, 'lus', 1, 'cor', 1 );
				CoC.player.orgasm();
			}
			//Male or genderless;
			if( CoC.player.gender === 0 || CoC.player.gender === 1 ) {
				//Alternate male-only case;
				if( CoC.player.gender === 1 && Utils.rand( 2 ) === 0 ) {
					EngineCore.outputText( ImageManager.showImage( 'imp-loss-male-fuck' ), false );
					EngineCore.outputText( 'Your eyes glaze over with lust as the imp\'s dark magic destroys your will to continue fighting. You sink to your ', true );
					if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
						EngineCore.outputText( 'hocks and knees, your ' + Descriptors.cockDescript( 0 ) + ' hurting from the massive blood pressure caused by your unbridled lust. He approaches you and stops about two feet in front of you, watching with delight your helpless state', false );
					} else {
						EngineCore.outputText( 'knees, pull out your ' + Descriptors.cockDescript( 0 ) + ' and begin mindlessly stroking yourself as the imp approaches you, a wicked grin on his face. Your mind races with thoughts and images of sucking the imp\'s cock. He approaches you and stops about two feet in front of you, watching with delight as you succumb to your own lust', false );
					}
					EngineCore.outputText( '. Your eyes glance down to his waist and see a massive bulge form under his loincloth, the sight of which causes your ' + Descriptors.cockDescript( 0 ) + ' to twitch and begin leaking pre-cum.\n\n', false );
					EngineCore.outputText( 'The imp drops his loincloth, revealing his huge 12-inch penis, and then forcefully grabs your head and pulls you down on to his hard throbbing demon dick. He shoves his cock past your lips and deep down your throat in one slow, forceful push. You can barely accommodate his huge cock, and yet your lust makes you hunger for more. You cough and gag while the imp proceeds to fuck your mouth hard, slapping his hot balls against your chin, disregarding your need to breathe.  ', false );
					if( CoC.player.lowerBody === AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
						EngineCore.outputText( 'Dropping down to the ground, your ' + Descriptors.cockDescript( 0 ) + ' trembles against your body to the rhythm of the imp\'s thrusts, leaving your underbelly smeared with its own pre-cum.\n\n', false );
					} else {
						EngineCore.outputText( 'On all fours now, your ' + Descriptors.cockDescript( 0 ) + ' bounces up and down against you to the rhythm of the imp\'s thrusts, leaving your belly smeared in your own pre-cum.\n\n', false );
					}
					if( CoC.player.ballSize >= 5 ) {
						EngineCore.outputText( 'Your huge ' + Descriptors.ballsDescriptLight() + ' swing heavily against you as well, responding to the force of the imp\'s thrusts, slapping your own ass and driving your ' + Descriptors.cockDescript( 0 ) + ' even stiffer with lust, the pre-cum pulsing out of your cock in time with the slapping.\n\n', false );
					}
					EngineCore.outputText( 'You begin to feel light-headed from lack of air just as the imp grips your head firmly and begins making rapid, shallow thrusts down your throat, nearing his orgasm. Suddenly he clenches tight, his claws digging into your head and thrusts down your throat as far as he can, holding his massive cock deep in your stomach. Your eyes go wide as you feel the imp\'s balls on your chin spasm violently.  His cock pulses in your mouth as the thick demon cum is pumped violently down your throat. It feels like an eternity as the imp continues to fill your guts with his hot cum, his orgasm lasting far longer than any human\'s. He slowly withdraws his still-pumping cock from you, coating your throat and then mouth with an almost continual spray of his unnaturally hot and sticky demon seed. The imp pulls out of your mouth just in time to splatter your face with his cum before his orgasm stops, coating your lips, nose, eyes, and hair with his incredibly thick and sticky cum.\n\n', false );
					EngineCore.outputText( 'You fall to the ground gasping, exhausted and unable to move, the demon cum on your face and inside you still burning with intense heat and corruption. You lose consciousness, your ' + Descriptors.cockDescript( 0 ) + ' still firmly erect, your lust not sated.', false );
					EngineCore.dynStats( 'lus', 20, 'cor', 2 );
					Combat.cleanupAfterCombat();
					CoC.player.slimeFeed();
					return;
				} else {
					CoC.player.slimeFeed();
					EngineCore.outputText( 'You sink to the ground, too overcome by lust and desire to fight.  The imp smiles and circles you, dropping his loincloth as he goes.  You are roughly shoved to the ground, your backside slapped hard.  You\'re too horny to do anything but moan from the pain ', false );
					if( CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
						EngineCore.outputText( 'as you are disrobed', false );
					}
					EngineCore.outputText( '.  As the imp presses a large bulk against your backside, you realize he has a massive penis!\n\nThe imp pushes his ' + CoC.monster.cockDescriptShort( 0 ) + ' into your ass and fucks you hard, with little regard to your pleasure.  After a rough fucking, he cums, stuffing your ass full of hot demon cum.  His orgasm lasts far longer than any human\'s, leaving your belly slightly distended.', false );
					CoC.player.buttChange( CoC.monster.cockArea( 0 ), true, true, false );
					EngineCore.dynStats( 'lib', 1, 'sen', 1, 'lus', 1, 'cor', 1 );
					if( CoC.player.sens > 40 ) {
						EngineCore.outputText( '  You manage to orgasm from the feeling of being filled by hot cum.', false );
						if( CoC.player.gender === 1 ) {
							EngineCore.outputText( '  You jizz all over the ground in front of you, spraying cum in huge squirts in time with the demon\'s thrusts.', false );
						}

						CoC.player.orgasm();
						EngineCore.dynStats( 'cor', 1 );
					}
					EngineCore.outputText( '\n\nYou drop to the ground when he\'s done with you, cum spilling from your abused ass all over the ground, too exhausted to move.  Consciousness fades.  ', false );
				}
			}
		}
		//HP or insta-loss;
		else {
			EngineCore.outputText( '\n<b>You fall, defeated by the imp!</b>\nThe last thing you see before losing consciousness is the creature undoing its crude loincloth to reveal a rather disproportionately-sized member.', false );
		}
		Combat.cleanupAfterCombat();
	};
	//noogai McNipple-holes;
	ImpScene.prototype.noogaisNippleRape = function() {
		EngineCore.outputText( '', true );
		EngineCore.outputText( 'You slowly walk over to the masturbating imp, your ' + Descriptors.hipDescript() + ' and ' + Descriptors.buttDescript() + ' swaying suggestively with every step.\n\n', false );
		EngineCore.outputText( 'Shedding your clothes you push the imp to the ground and straddle him, keeping his hands away from his twitching pecker while you quickly tie him up with his own loincloth.  The lust-addled demon utterly incapacitated, you start to use both of your hands to toy freely with your slimy nipple-holes, as well as your ', false );
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( Descriptors.cockDescript( 0 ), false );
		}
		if( CoC.player.hasCock() && CoC.player.hasVagina() ) {
			EngineCore.outputText( ' and ', false );
		}
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( Descriptors.vaginaDescript( 0 ), false );
		} else if( CoC.player.gender === 0 ) {
			EngineCore.outputText( Descriptors.assholeDescript(), false );
		}
		EngineCore.outputText( '.\n\n', false );
		EngineCore.outputText( 'You gently insert a single digit into one of your nipple-cunts, ', false );
		if( CoC.player.lactationQ() >= 1000 ) {
			EngineCore.outputText( 'unleashing a torrent of thick, creamy milk and ', false );
		}//(if regular milky; ;
		else if( CoC.player.lactationQ() >= 50 && CoC.player.biggestLactation() >= 1 ) {
			EngineCore.outputText( 'releasing a steady trickle of warm milk and ', false );
		}
		EngineCore.outputText( 'lust-induced sex juice onto the imp\'s lap; your other hand instinctively moves down to stroke your ', false );
		//((if male/herm; ;
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( 'rock-hard cock', false );
			if( CoC.player.hasVagina() ) {
				EngineCore.outputText( ' and ', false );
			}
		}
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'dripping wet pussy', false );
		}
		if( CoC.player.gender === 0 ) {
			EngineCore.outputText( Descriptors.assholeDescript(), false );
		}
		EngineCore.outputText( ', teasing him with a lewd moan as your head rolls back in sexual ecstasy.', false );
		if( EngineCore.silly() ) {
			EngineCore.outputText( '  The imp is sickened, but curious.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'You continue finger-fucking your nipple, becoming more and more aroused as the imp gets harder and harder from watching the exotic display before him.  You soon tire of watching the imp squirm beneath you, desperate for sexual relief; you slowly move your hand away from your groin, reaching down towards his crotch, and start to toy with his apple-sized balls, fondling and squeezing them roughly.  You casually slip a second finger into your wet nipple-hole, stretch it out teasingly, and hold the gaping orifice in front of the imp\'s face, giving him a good view of the inside of your freakish, wet nipple-cunt.\n\n', false );
		//(If corrupt: ;
		if( CoC.player.cor >= 66 ) {
			EngineCore.outputText( '"<i>Mmm, wouldn\'t you just love to stick your fat cock into this sopping wet hole, and cum deep inside my ' + Descriptors.chestDesc() + '?</i>"  You whisper huskily into his ear, sliding your fingers away from his balls and up along the underside of his aching dick, teasing every inch of it until you reach his swollen head and start rubbing your finger around his glans in small circles.  The imp is panting heavily, his eyes firmly locked on your ', false );
			//(if normal);
			if( CoC.player.biggestLactation() < 1 ) {
				EngineCore.outputText( 'wet', false );
			}//(if lactating);
			else {
				EngineCore.outputText( 'milky', false );
			}
			EngineCore.outputText( ', bucking his hips upwards in desperation.\n\n', false );
		}
		EngineCore.outputText( 'Deciding that the poor bastard has suffered enough, you guide your stretched ' + Descriptors.nippleDescript( 0 ) + ' down to his quivering member and hold it over the tip for a moment.  The imp groans in frustration, feeling the heat of your slutty juices dripping down onto his aching rod and overfull testes, making him even more desperate to drive deep into your waiting breast.  Without warning, you forcefully shove your breast onto his swollen fuckstick, ', false );
		if( CoC.player.biggestTitSize() <= 4 ) {
			EngineCore.outputText( 'bottoming out halfway on his immense dick.', false );
		} else {
			EngineCore.outputText( 'only stopping when the flesh of your immense mammary bumps into his quaking ballsack.', false );
		}
		EngineCore.outputText( '\n\n', false );
		EngineCore.outputText( 'You shudder in ecstasy as you rise off of his drenched girth; your nipple-hole is slick with arousal, making it easier for you to slide back down until ', false );
		//((if breast size below D) ;
		if( CoC.player.biggestTitSize() <= 4 ) {
			EngineCore.outputText( 'you feel his swollen cock bottom out, your petite breast unable to swallow any more of his throbbing maleness', false );
		}//((over D) ;
		else {
			EngineCore.outputText( 'his swollen cock and desperately filled balls are entirely engulfed in tit-flesh', false );
		}
		EngineCore.outputText( '.  Eventually the imp starts timing his thrusts with your movements, and soon the two of you are working in a steady rhythm - thrust, retract, thrust, retract.  Minutes go by as the rhythm slowly builds towards a crescendo, with the only sounds being the lewd schlicking noise of your breast servicing the imp\'s rod, and the odd moan escaping your lips.  While one hand is furiously jilling off your vacant nipple-slit, the other one is furiously', false );
		//[(if male);
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( ' pumping your ' + Descriptors.cockDescript( 0 ), false );
		}//(if female);
		else if( CoC.player.hasVagina() ) {
			EngineCore.outputText( ' fingering your hungry baby tunnel', false );
		} else {
			EngineCore.outputText( ' fingering your tingling anus', false );
		}
		EngineCore.outputText( '.\n\n', false );
		EngineCore.outputText( 'Eventually the rhythm becomes more sporadic as you and the imp approach climax; your tongue rolls out of your open mouth and your toes curl as you feel the imp spasm violently inside you, letting an endless stream of his searing spunk pour directly into your ' + Descriptors.chestDesc() + '.  The intense heat pushes you over the edge and ', false );
		//(if dick);
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( 'a ', false );
			//[(cum production < 500ml);
			if( CoC.player.cumQ() < 500 ) {
				EngineCore.outputText( 'jet ', false );
			}//(cum production 500-1000ml);
			else if( CoC.player.cumQ() < 1000 ) {
				EngineCore.outputText( 'geyser ', false );
			}//(cum production > 1000ml);
			else {
				EngineCore.outputText( 'volcano ', false );
			}
			EngineCore.outputText( 'of cum sprays from your ' + Descriptors.cockDescript( 0 ) + ' and splatters over both you and the hapless imp', false );
			if( CoC.player.hasVagina() ) {
				EngineCore.outputText( ', while ', false );
			}
		}
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'your pussy juices spurt out as your ' + Descriptors.vaginaDescript( 0 ) + ' twitches in orgasm', false );
		}
		if( CoC.player.gender === 0 ) {
			EngineCore.outputText( 'your asshole clenches tight on your finger', false );
		}
		EngineCore.outputText( '.\n\n', false );
		EngineCore.outputText( 'You collapse heavily on top of the imp, once again impaling your breast on his still-erect cock.  You lie like this for a few moments until you notice that the imp has dozed off, exhausted by the whole ordeal.  You stand up woozily as a mixture of ', false );
		//(if lactating) ;
		if( CoC.player.biggestLactation() >= 1 && CoC.player.lactationQ() < 40 ) {
			EngineCore.outputText( 'milk, ', false );
		}
		EngineCore.outputText( 'fem-spunk and hot demon cum leaks out from your gaping nipple-cunt.\n\n', false );
		//(if corruption > 60);
		if( CoC.player.cor > 60 ) {
			EngineCore.outputText( 'You thrust your digits into your ' + Descriptors.nippleDescript( 0 ) + ' once more, scooping out as much imp jizz as you can reach.  You happily drink up the thick goo, savoring the cloying taste before quickly getting dressed and leaving the imp to slumber.', false );
		}
		//(continue to non-corrupt text);
		//(if not);
		else {
			EngineCore.outputText( 'You quickly get dressed and leave the imp to his slumbering, his hands still tied together by his loincloth.', false );
		}
		//Gain xp and gems here;
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -3, 'cor', 1 );
		Combat.cleanupAfterCombat();
	};
	//IMP LORD;
	ImpScene.prototype.impLordEncounter = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'A large corrupted imp crosses your path. He flashes a cruel smile your way.  No way around it, you ready your ' + CoC.player.weaponName + ' for the fight.' );
		Combat.startCombat( new ImpLord() );
	};

	//Rewards;
	//+20 XP;
	//+7-15 Gems;
	//Common Drops: Imp Food & Incubus Draft;
	//Rare Drops: LaBova & Minotaur Blood;
	ImpScene.prototype.defeatImpLord = function() {
		EngineCore.clearOutput();
		if( CoC.monster.HP < 1 ) {
			EngineCore.outputText( 'The greater imp falls to the ground panting and growling in anger.  He quickly submits however, the thoroughness of his defeat obvious.  You walk towards the imp who gives one last defiant snarl before slipping into unconsciousness.' );
			Combat.cleanupAfterCombat();
		} else {
			EngineCore.outputText( 'The muscular imp groans in pained arousal, his loincloth being pushed to the side by his thick, powerful dick.  Grabbing the useless clothing, he rips it from his body, discarding it.  The imp\'s eyes lock on his cock as he becomes completely ignorant of your presence.  His now insatiable lust has completely clouded his judgment.  Wrapping both of his hands around his pulsing member he begins to masturbate furiously, attempting to relieve the pressure you\'ve caused.' );
			//Leave // Rape];
			EngineCore.menu();
			if( CoC.player.lust >= 33 ) {
				EngineCore.addButton( 0, 'Sex', this.sexAnImpLord );
			}
			EngineCore.addButton( 9, 'Leave', Combat.cleanupAfterCombat );
		}
	};
	ImpScene.prototype.loseToAnImpLord = function() {
		EngineCore.clearOutput();
		if( CoC.player.hasVagina() && (CoC.player.gender === 2 || Utils.rand( 2 ) === 0) ) {
			this.getRapedAsAGirl();
		} else if( CoC.player.hasCock() ) {
			this.loseToImpLord();
		} else {
			EngineCore.outputText( 'Taking a look at your defeated form, the imp lord snarls, "<i>Useless,</i>" before kicking you in the head, knocking you out cold.' );
			CoC.player.takeDamage( 9999 );
			Combat.cleanupAfterCombat();
		}
	};
	//Rape;
	ImpScene.prototype.sexAnImpLord = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You grin evilly and walk towards the defeated corrupted creature.  He doesn\'t take notice of you even though you\'re only inches away from him.  You remove your [armor] slowly, enjoying the show the imp is giving you.  But soon it\'s time for you to have fun too.' );
		//(No line break);
		//if(CoC.player doesn't have centaur legs);
		if( !CoC.player.isTaur() ) {
			EngineCore.outputText( '  You grab his hands, removing them from his ' + CoC.monster.cockDescriptShort( 0 ) + '. This gets his attention immediately, and you grin widely, pinning him to the ground.' );
		} else {
			EngineCore.outputText( '  You place one of your front hooves on his chest, knocking him onto his back.  He attempts to get back up, but you apply more pressure to his thick, manly chest, until he gasps.  The imp gets the idea quickly and stops masturbating, all of his focus now on you.' );
		}

		EngineCore.menu();
		//Continues in, Male Anal, Female Vaginal, or Breastfeed;
		EngineCore.addButton( 9, 'Leave', Combat.cleanupAfterCombat );
		if( CoC.player.lust >= 33 ) {
			if( CoC.player.hasCock() && CoC.player.cockThatFits( CoC.monster.analCapacity() ) >= 0 ) {
				EngineCore.addButton( 0, 'FuckHisAss', this.impLordBumPlug );
			}
			if( CoC.player.hasCock() ) {
				EngineCore.addButton( 1, 'Get Blown', this.getBlownByAnImpLord );
			}
			if( CoC.player.hasVagina() ) {
				EngineCore.addButton( 2, 'Ride Cock', this.femaleVagRape );
			}
			if( CoC.player.findPerk( PerkLib.Feeder ) >= 0 ) {
				EngineCore.addButton( 3, 'Breastfeed', this.feederBreastfeedRape );
			}
		}
	};
	//MALE ANAL;
	ImpScene.prototype.impLordBumPlug = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( ImageManager.showImage( 'implord-win-male-fuck' ), false );
		var x = CoC.player.cockThatFits( CoC.monster.analCapacity() );
		if( x < 0 ) {
			x = CoC.player.smallestCockIndex();
		}
		EngineCore.outputText( 'You grab the muscular creature by one of his long pointed ears, pulling him to his feet. He protests slightly, and gives a slightly defiant snarl of discomfort.  Lucky for him you\'re in a forgiving mood and ignore his whining.' );
		//(No line break);
		if( CoC.player.tallness < 72 ) {
			EngineCore.outputText( '  You give a powerful shove and push the imp to his knees.' );
		}
		EngineCore.outputText( '  You pull the imp\'s head towards your [hips], forcing his lips against the base of your ' + Descriptors.cockDescript( x ) + '.  The imp quickly gets the idea and begins to lick and suckle at your ' + CoC.player.cockHead( x ) + ' expertly.' );
		EngineCore.outputText( '\n\nYou pet the top of his smooth head encouragingly, his tongue quickly soaking your length in saliva.  With little encouragement, the imp begins to take your ' + Descriptors.cockDescript( x ) + ' into his mouth, focusing on milking the head of its delicious precum.  You soon remember what you\'d intended to do with the little cock slut, and push him away from your length.  You could swear the imp whimpered in response to this, which makes you grin.' );
		EngineCore.outputText( '\n\nYou spin your finger around, signaling the imp to turn around.  His eyes widen in response, clearly understanding what you have intended.  He nervously obeys, spinning around and even crouching forward. The invitation looks incredibly tempting, his hole looks fairly well used but your arousal keeps you from complaining.' );
		EngineCore.outputText( '\n\nYou drape your ' + Descriptors.cockDescript( x ) + ' between the imp\'s butt cheeks.  Teasingly you begin thrusting between the muscular cleft of his ass, much to the creature\'s dismay.  The greater imp whines submissively, desperate for you to enter him.  His ' + CoC.monster.cockDescriptShort( 0 ) + ' drools as you tease his ass, creating a small puddle of pre between his hooves.  The poor creature becomes so desperate that he reaches back and spreads his muscular cheeks with his hands.  You catch a small glimpse of his now gaping hole as your cock continues to slide between his cheeks.  You tease him with one last empty thrust, before grabbing his shoulders and forcing your ' + Descriptors.cockDescript( x ) + ' deep inside the poor creature.' );
		EngineCore.outputText( '\n\nThe imp loses control immediately and nearly collapses from the massive orgasm.  His large, corruption-bloated balls clench up, and semen floods out of his ' + CoC.monster.cockDescriptShort( 0 ) + ' like a fountain.  The hot demon seed puddles around his feet, soaking the ground in his thick boy-goo.' );
		EngineCore.outputText( '\n\nHis orgasm also cause his anus to tighten and spasm around your ' + Descriptors.cockDescript( x ) + ', as if he was milking you of your seed.  Unable to resist, you start plunging yourself rapidly in and out of the spasming hole.' );
		//(No line break);
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( '  You feel the slapping of your [balls] against the imp\'s, a sensation that only spurs you on, causing you to slam into him over and over wildly.' );
		}
		if( CoC.player.biggestTitSize() >= 1 && CoC.player.lactationQ() >= 200 ) {
			EngineCore.outputText( '  You give a desperate groan, and grab one of your [chest] roughly.  You pinch and massage your ' );
			if( CoC.player.averageNipplesPerBreast() > 1 ) {
				EngineCore.outputText( '[nipples]' );
			} else {
				EngineCore.outputText( '[nipple]' );
			}
			EngineCore.outputText( ', making you moan in ecstasy and leak milk, quickly soaking your chest.' );
		}
		//if(CoC.player has Fertility perk && CoC.player.balls >= 4);
		if( CoC.player.balls >= 4 ) {
			EngineCore.outputText( '\n\nAs much as you would love to continue the pleasure you can\'t last any longer.  You howl in intense pleasure and cum.  Your [balls] tighten against your body, and empty their contents. Your ' + Descriptors.cockDescript( x ) + ' pulses and spasms, releasing wave and wave of semen into the greater imp\'s belly.  The pleasure is intense, and almost painful as your cum.' );
			//if(CoC.player is a herm);
			if( CoC.player.gender === 3 ) {
				EngineCore.outputText( '\n\nAs your ' + Descriptors.cockDescript( x ) + ' erupts, your ' + Descriptors.vaginaDescript( 0 ) + ' tenses up tightly, spasming, desperate to be filled.  After a moment your girl juice begins to soak your inner thighs.  Your legs begin to tremble from the intensity of it all, and you question if you\'ll be able to make it back to your camp after this.' );
			}

			EngineCore.outputText( '\n\nThe imp howls as his ass is flooded with cum.  His stomach begins to expand from the sheer amount of fluid you pump into him, and the sensation of being over filled causes the poor creature to cum a second time, spilling more semen into the already massive puddle.  His ' + CoC.monster.cockDescriptShort( 0 ) + ' pumps wave after wave of corrupt seed onto the ground, soaking his hooves even further.' );
			EngineCore.outputText( '\n\nYou\'re sure you must have blacked out at some point as you feel the last of your seed force its way out of your ' + Descriptors.cockDescript( x ) + ' and into the imp\'s demon belly.  You wobble slightly and lean down, grabbing the ragged remains of the imp\'s loincloth.  Weakly you pull out of the demon\'s hole, and quickly stuff the cloth in its place as a makeshift plug.' );
			EngineCore.outputText( '\n\nThe imp collapses face first into his thick cum puddle before rolling over.  Now soaked in his own cum the imp gently rubs his bulging belly, feeling your seed slosh around inside him.  He gives a contented sigh and passes out in his puddle of cum.' );
		} else {
			EngineCore.outputText( '\n\nSlamming your [hips] into the imp\'s muscular ass a few more times is all it takes you send you over the edge. Thinking quickly, you pull out completely.  Smashing your hips together one last time, you hot dog your ' + Descriptors.cockDescript( x ) + ' between the two muscular mounds.  You let out a howl of pleasure as you spill your seed across the imp\'s backside.  The orgasm is so intense that several ropes of semen land across the imp\'s bald skull.' );
			EngineCore.outputText( '\n\nAt the end of your orgasm, the poor creature is coated with your seed, marking him as the slut he is.  You release the exhausted imp and he falls forward into the puddle of his own semen.  The imp doesn\'t seem finished however, his ' + CoC.monster.cockDescriptShort( 0 ) + ' is still hard, throbbing and drooling pre like a faucet.  The poor thing begins to jerk himself off feverishly, using his earlier spilled cum as a lubricant.  You consider staying for another round, but decide against it when your [legs] begin to wobble from exhaustion.' );
		}
		EngineCore.outputText( '\n\nYou stumble slightly as you gather up your [armor], and begin to get dressed.' );
		CoC.player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		Combat.cleanupAfterCombat();
	};
	//MALE BLOW;
	ImpScene.prototype.getBlownByAnImpLord = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( ImageManager.showImage( 'implord-win-male-bj' ), false );
		EngineCore.outputText( 'You lay your [cock biggest] along the demon\'s muscular chest.  Thrusting experimentally, your [cock biggest] leaves a thick trail of precum across the imp\'s cheek.  You begin to moan as you continue your casual thrusting across the imp\'s body.  The defeated creature squirms under you in protest, oblivious to the fact that the squirming is only increasing your stimulation.  It doesn\'t take you long to coat the imp\'s face and part of his chest in your thick precum.  Casually stepping back, you look at the imp from top to bottom, and back again.  You can\'t help but chuckle at what you see.' );
		EngineCore.outputText( '\n\nYour scent has overwhelmed the imp, his thick red dick is painfully hard and dripping, while he pants like a dog.  No longer being pinned down seems to have improved his mood however as he gets to his knees and crawls back towards your [cock biggest].  The imp sits between your [feet] and looks up at you nervously.' );
		EngineCore.outputText( '\n\nYou let yourself stare at the imp coldly for several long moments before smirking and giving a nod of approval.  Approval that the imp is more than happy to have. He places both his clawed hands around your [cock biggest] and pulls your [cockHead biggest] into his mouth, expertly suckling the tip.  His hands work up and down your length, rubbing and massaging all the right places. You moan happily as the demon works his magic.' );
		//[pg];
		EngineCore.outputText( '\n\n' );
		//if(cock thickness < 7);
		if( CoC.player.cocks[ CoC.player.biggestCockIndex() ].cockThickness < 7 ) {
			EngineCore.outputText( 'The imp begins to swallow more and more of your length, taking several inches before pulling back.  He twists his head and tongue worships your [cock biggest] with his mouth.  His tight mouth tightens more and relaxes as he swallows more of your precum.' );
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( '  His hands move down towards your [balls].' );
			}
			EngineCore.outputText( '\n\n' );
			//if(balls > 0);
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( 'The demon gropes and massages your [sack] roughly, forcing a large squirt of precum to shoot down his throat.  He swallows the treat happily and continues his cruel groping of your [balls].  His hands work wonders of your [sack], milking your [balls] in a way you didn\'t know possible.  It\'s clear he\'s done this many times before and is an expert of pleasuring males.  You chuckle between your moans, you definitely made a good choice with this one.\n\n' );
			}
			//else if(balls === 0);
			else {
				EngineCore.outputText( 'The demon seems to be searching for your testicles, but when he doesn\'t find anything, he moves his hand a bit further.\n\n' );
			}

			//if(hasVagina);
			if( CoC.player.hasVagina() ) {
				EngineCore.outputText( 'A pair of fat red fingers slip into your [vagina] making you gasp in surprise, and clench your walls around the intruders.  After a moment, you relax as those clawed fingers scratch and rub your walls in a way you didn\'t know possible.  You groan loudly as you draw closer and closer to orgasm.' );
			} else {
				EngineCore.outputText( 'Two fat red fingers force their way into your [asshole] making you yelp in surprise.  The surprise turns quickly to pleasure as those fingers dance along your insides, massaging places you didn\'t know you had.  You might have been annoyed at the imp for the advancements if it hadn\'t felt so good.  You can\'t help but pant in ecstasy while those clawed fingers gently scratch at your prostate, drawing you closer and closer to orgasm.' );
			}
		}
		//else if(cock thickness >= 7);
		else {
			EngineCore.outputText( 'Though you\'re far too thick to fit any further into the imp\'s mouth, it doesn\'t stop him from trying.  The crimson demon works your length in every way he can.  His hands rub up and down your length.  You admire the effort as the little demon tries to fit more of your [cockHead biggest] into his mouth.  It soon becomes clear to the imp however, that that\'s not possible.  He pulls back off your length, his hands still rubbing up and down your shaft.  He looks at your cock slit, and presses his lips to it, forcing his tongue into your leaking urethra.  You yelp in surprise as the wet muscle makes its way shockingly deep into your [cock biggest].  His muscular hands work your length furiously while his tongue abuses your insides.  It doesn\'t take a lot of that treatment to have you teetering on the edge of orgasm.' );
		}
		EngineCore.outputText( '\n\nThe little demon continues to work your length for a few moments before you reach your limit. You howl in ecstasy, thrusting forward into the imp\'s tight mouth.' );
		//if(cumNormal or cumMedium) ;
		if( CoC.player.cumQ() < 500 ) {
			EngineCore.outputText( '  You cum hard, easily filling the imp\'s hot mouth.  He swallows your load just as easily, grinning as he suckles your [cockHead biggest] happily.  He suckles for a few minutes, getting the last few drops of seed before letting your [cock biggest] drop from his mouth with a soft pop.' );
		}//if(cumHigh) ;
		else if( CoC.player.cumQ() < 1000 ) {
			EngineCore.outputText( '  You cum painfully hard, filling the demon\'s mouth beyond what it can hold.  Surprisingly the imp manages to swallow almost all of your spunk anyways, only allowing a little bit of his meal to dribble past his lips.  He pulls back and gives your [cock biggest] a few last licks, cleaning up any left over seed.' );
		}//if(cumVeryHigh or cumExtreme);
		else {
			EngineCore.outputText( '  Cum floods out of your urethra like a faucet, quickly filling the imp\'s tight mouth regardless of how fast he tries to swallow.  You step back, your length popping out of the demon\'s mouth.  The imp acts quickly, shutting his eyes and opening his mouth wide, as your seed splatters his face, chest and tongue.  Your [cock biggest] spasms from the powerful orgasm, quickly coating the imp in your hot spunk.  It takes several minutes for your orgasm to end, you manage to look at the cum soaked imp as he begins wiping your cum up with his hands.  His muscular hands don\'t stay cum soaked for long as he begins suckling each finger and licking his palms.' );
		}

		EngineCore.outputText( '\n\nYou gather your things and put your [armor] back on before turning to leave.  You chance one last glance back at the defeated imp. You notice him laying down on his back, his hands working his own still hard length furiously.  You head back for camp and allow the imp to enjoy the afterglow of his meal.' );
		CoC.player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		Combat.cleanupAfterCombat();
	};
	//FEMALE VAGINAL;
	ImpScene.prototype.femaleVagRape = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( ImageManager.showImage( 'implord-win-female-fuck' ), false );
		EngineCore.outputText( 'With little ceremony you grab the imp\'s ' + CoC.monster.cockDescriptShort( 0 ) + ' and begin to jerk your hand up and down roughly.  The little muscular beast begins to whine loudly, in protest to the rough and likely painful mistreatment of his ' + CoC.monster.cockDescriptShort( 0 ) + '.  In spite of the protests, the rough treatment goes over well, as the creature begins to leak hot demon pre across your hand, which you smear across the shaft as a natural hot lube.' );
		EngineCore.outputText( '\n\nLicking your lips, you squat above the little demon, positioning your ' + Descriptors.vaginaDescript( 0 ) + ' above the thick log of meat.  You stay still for a moment, and question if this was a good idea.  The demon was so thick you hadn\'t even been able to fit your hand around his shaft.  There was little chance you\'d get out of this without some rather rough stretching, but the scent of the demon\'s arousal, and your corrupt lust spur you onwards.' );
		EngineCore.outputText( '\n\nYou lower yourself, slowly, watching as the head of the demon\'s ' + CoC.monster.cockDescriptShort( 0 ) + ' begins to spread your ' + Descriptors.vaginaDescript( 0 ) + '.  You begin to pant as you\'re stretched wide; you can hardly believe you can take him.  It takes you several minutes of steady, shallow, downward thrusts before the imp is completely hilted inside of your body.  You sit still for a moment to adjust to the intense sensation. The muscular creature doesn\'t seem to mind, as his tongue is hanging slightly out of the side of his mouth, panting like a dog.' );
		CoC.player.cuntChange( CoC.monster.cockArea( 0 ), true, true, false );
		EngineCore.outputText( '\n\nAs you adjust, you get a devilish idea.  Both your hands gently begin to massage the imp\'s muscular abs and chest; before taking each of his fertite-pierced nipples between your fingers.  You pinch and tug upwards, roughly playing with his sensitive nipples.  The imp instinctively bucks his hips, slamming into you roughly, making you yelp and clench your [vagina] around his ' + CoC.monster.cockDescriptShort( 0 ) + '.' );
		EngineCore.outputText( '\n\nIt takes a moment, but the pleasure of that begins to wash over you in a heavenly wave.  You continue to roughly tease the imp\'s nipples, causing him to buck upwards into your waiting womb instinctively.  Neither of you complain as the sensation is incredibly intense, and well worth the slight bit of discomfort.' );
		if( CoC.player.cockTotal() === 1 ) {
			if( CoC.player.cocks[ 0 ].cockLength < 8 ) {
				EngineCore.outputText( '\n\nThe intense stimulation causes your ' + Descriptors.cockDescript( 0 ) + ' to begin leaking pre across the imp\'s stomach.  You remove one hand from the imp\'s nipples to pay attention to your aching ' + Appearance.cockNoun( CockTypesEnum.HUMAN ) + '.  As you begin jerking yourself off, more and more pre puddles on the imp\'s abs.  Your pre begins to pool in and overflow from the imp\'s tight belly button.' );
			} else if( CoC.player.cocks[ 0 ].cockLength <= 16 ) {
				EngineCore.outputText( '\n\nThe intense stimulation causes your ' + Descriptors.cockDescript( 0 ) + ' to begin leaking pre across the imp\'s chest.  You remove one hand from the imp\'s nipples to pay attention to your aching ' + Descriptors.cockDescript( 0 ) + '.  As you begin jerking yourself off, more and more pre drips across the imp\'s aching nipples, your pre a warm relief for the tender abused teats.  The warmth of your juice across his chest makes the little demon moan and buck harder into your ' + Descriptors.vaginaDescript( 0 ) + '.' );
			} else {
				EngineCore.outputText( '\n\nAs your ' + Descriptors.vaginaDescript( 0 ) + ' is pounded relentlessly, your rock hard ' + Descriptors.cockDescript( 0 ) + ' slaps the imp in the face, each time leaving another trail of pre in its wake.  The imp\'s arousal only intensifies from this, and he\'s soon lapping and suckling at your ' + Descriptors.cockDescript( 0 ) + ', expertly trying to get you off.' );
				EngineCore.outputText( '\n\nIt\'s not long before the imp\'s face is soaked in your pre, and thanks to the imp\'s oral ministrations your ' + Descriptors.cockDescript( 0 ) + ' is now leaking pre continually. It\'s only a matter of time before you blow now.' );
			}
		} else if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( '\n\nAs you continue your cruel torture of the imp\'s now bruised nipples, he reaches up both of his hands and takes hold of your ' + Descriptors.multiCockDescriptLight() + '.  The imp feverishly masturbates your ' + Descriptors.cockDescript( 0 ) + ' and ' + Descriptors.cockDescript( 1 ) + ' as he thrusts into your ' + Descriptors.vaginaDescript( 0 ) + '.  The intense stretching of your ' + Descriptors.vaginaDescript( 0 ) + ' by the ' + CoC.monster.cockDescriptShort( 0 ) + ' sends waves of pleasure coursing through you, straight into your ' + Descriptors.multiCockDescriptLight() + ', which are now leaking precum profusely onto the imp\'s muscular body.' );
		}
		EngineCore.outputText( '\n\nYou give one final rough tug on the imp\'s nipples, and that\'s all he can handle.  His cock spasms inside your ' + Descriptors.vaginaDescript( 0 ) + ' and erupts, sending wave after wave of hot, demon cum into your womb. His tainted testes spasm in their taut sack, continuing to pour their contents into you, until your belly is swollen and full of the hot seed.  You gasp in pleasure, unable to fight the pleasure of being filled so thoroughly.  Your ' + Descriptors.vaginaDescript( 0 ) + ' spasms, and you clench around the ' + CoC.monster.cockDescriptShort( 0 ) + ' inside of you, as your girl juices begin to flow out of you with your earth shattering orgasm.' );
		if( CoC.player.cockTotal() === 1 ) {
			EngineCore.outputText( '\n\nWith your orgasm, your ' + Descriptors.cockDescript( 0 ) + ' erupts, sending waves of boy goo across the imp\'s already drenched body.  The imp mewls as your seed spills across his masculine body, marking him as the bitch he is.  He leans forward and takes your cock into his mouth, suckling what\'s left of your orgasm out of you.  The imp drinks down all the cum he can. His mouth feels so hot, you don\'t really want it to end, but soon the orgasm settles down and you come back to reality from your lust induced euphoria.' );
			EngineCore.outputText( '\n\nThe imp gives you a lewd smirk and licks his lips of your boy cum.  You chuckle and give the imp a light smack on his cum soaked chest.' );
		} else if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( '\n\nAs you ride out your orgasm the crafty imp pulls your ' + Descriptors.cockDescript( 0 ) + ' and ' + Descriptors.cockDescript( 1 ) + ' towards his mouth. Locking his lips around the tips of your two cocks, he suckles down every last drop of your jizz they offer.  You begin to mewl and whine in desperation as your orgasm seems to last an eternity.  The imp\'s skilled tongue and cock manage to work all of your favorite and most sensitive spots, sending you into complete euphoria.  Once your orgasm begins to settle the imp pulls back allowing the last few strings of semen to splatter across his face.' );
		}
		EngineCore.outputText( '\n\nAfter a few moments of recovery, you slowly lift yourself off the imp.  Cum rushes out of your ' + Descriptors.vaginaDescript() + ' and you clamp your muscles down as best as you can to keep the warm substance inside of you.  You give your swollen, cum-filled belly a motherly rub, before gathering your [armor].' );
		CoC.player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		CoC.player.slimeFeed();
		Combat.cleanupAfterCombat();
	};
	//FEEDER BREASTFEED RAPE;
	ImpScene.prototype.feederBreastfeedRape = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( ImageManager.showImage( 'implord-win-female-breastfeed' ), false );
		EngineCore.outputText( 'Standing over the fallen creature you lean forward and grab him by the horns, forcing his face against your [chest].  He protests wildly for a few moments, until you tire of this game.  Pushing him back to the ground, you step on his chest, keeping him pinned.  You start massaging your [nipple] and quickly feel your corrupt milk building up.  Timing things just right, you pinch your [nipple] one last time, causing a small eruption of milk to shoot out, just as you give the imp a swift kick to the gut.' );
		EngineCore.outputText( '\n\nThe kick knocks the wind out of the little demon, causing him to gasp.  His mouth opens just long enough and wide enough for the corrupt milk to go straight down his throat.  The reaction is almost instant; his eyes go wide with horror and disgust, but quickly change to awe and desire.  The poor thing tries to get up from under you but can\'t escape.' );
		if( CoC.player.tallness > 48 && CoC.player.tallness < 60 && CoC.player.lowerBody !== AppearanceDefs.LOWER_BODY_TYPE_CENTAUR ) {
			EngineCore.outputText( '\n\nYou allow the creature to stand, and lay back on the ground, patting your [chest] gently.  The aroused greater imp takes the hint, and crawls on top of you.  He quickly takes a [nipple] into his hungry waiting mouth.  He suckles gently, expertly milking you of your corrupt milk.  He\'s so good at it, you suspect he\'s done this several times before.  After a few minutes, he moves over to your next breast.  As he does you can feel his still rock hard, ' + CoC.monster.cockDescriptShort( 0 ) + ' poking at your nether regions.' );
			EngineCore.outputText( '\n\nYou grin, getting a wicked idea likely due to the pleasurable haze breastfeeding has given you.  You wrap your lower body around the imp\'s toned hips.  He looks up questioningly, unsure of your intentions.  You simply smirk and nod at him. The little demon\'s eyes lit up like Christmas, and he immediately thrusts his ' + CoC.monster.cockDescriptShort( 0 ) + ' into your [asshole] with no hesitation.  The sudden stretching would\'ve been painful; luckily the breastfeeding euphoria numbed much of the pain.' );
			CoC.player.buttChange( CoC.monster.cockArea( 0 ), true, true, false );
			EngineCore.outputText( '\n\nThe imp wildly thrusts in and out of you, while simultaneously suckling your [nipple].  He uses both his hands to simultaneously massage your [chest], as well as keep himself steady.  He\'s making the massage a little rougher than you\'d have liked, but you really can\'t complain about all the stimulation.  It\'s truly like nothing you\'ve experienced before.' );
			//if(CoC.player has a penis);
			if( CoC.player.hasCock() ) {
				EngineCore.outputText( '  [EachCock] twitches violently from the stimulation of your [asshole].  Pre-cum begins to dribble out of your ' + Descriptors.cockDescript( 0 ) + '.  You can\'t help but pant desperately as the warm pleasurable sensation of arousal fills your whole being.' );
			}
			if( CoC.player.hasVagina() ) {
				EngineCore.outputText( '  The intense stimulation of your [chest] is causing your [vagina] to become wet with girl juice... so much so that your femcum has started to seep down your taint towards your ass.  It\'s probably a good thing, as it\'s now become a lubricant for the greater imp\'s ' + CoC.monster.cockDescriptShort( 0 ) + '.' );
			}
			EngineCore.outputText( '\n\nAs the little demon suckles your second breast dry, you notice he\'s picked up the pace significantly.  You know what that means, and gently pull his head towards your [chest].  Cradling and petting his head, you clench your [asshole] encouragingly.  It only takes a few more thrusts for the imp to cum.  He floods your insides with his hot boy cream, and moans into your [chest].' );
			EngineCore.outputText( '\n\nAfter riding out his orgasm, the imp flops backwards onto the ground, his cock now semi-hard and coated in his juices.  He gives his slightly bloated belly a gentle, content rub.  You chuckle at him as he falls asleep contentedly.' );
			EngineCore.outputText( '\n\nYou pick yourself up, gather up your equipment and put your [armorName] back on.' );
			EngineCore.dynStats( 'lus', 50, 'cor', 1 );
		} else {
			EngineCore.outputText( '\n\nYou lean down, and allow the imp to stand back up.  He immediately throws himself against your breast, and begins to suckle on the closest [nipple].  You give a gentle moan and bask in the sensation of nursing the imp\'s insatiable hunger.  You notice the imp\'s member slowly shifting to a semi-hard state, and chuckle, gently patting his bald head encouragingly.' );
			EngineCore.outputText( '\n\nAs the milk-flow from your first breast slows, the imp moves to the second, continuing to suckle gently.  You feel two clawed hands reach up and begin massaging your chest, trying to stimulate more milk flow.  You decide to help, and begin massaging yourself as well.  The added stimulation seems to work, and the imp can hardly keep up with the flow, as some of the corrupt milk begins dribbling from the corner of his mouth.' );
			EngineCore.outputText( '\n\nYou notice the imp\'s once muscular belly has developed into a small round bulge, as if a layer of baby fat had formed over those toned muscles.' );
			if( CoC.player.bRows() === 1 ) {
				EngineCore.outputText( '\n\nAs your second breast\'s milk flow begins to slow, the imp curls up against you contently.  You cradle him for a moment, before laying the creature down, where he burps and falls asleep.  You chuckle at how cute these creatures are when they\'re passive.' );
			} else {
				EngineCore.outputText( '\n\nYou chuckle at the still very hungry imp, and begin massaging your second row of ' + Descriptors.breastDescript( 1 ) + ', occasionally pinching your ' + Descriptors.nippleDescript( 1 ) + 's, drawing a few beads of milk from them.  The imp makes short work of your first row of breasts and has moved towards your second.' );
				EngineCore.outputText( '\n\n"<i>So eager to please, aren\'t you?</i>" you say teasingly, though not expecting an answer from the imp\'s nipple filled mouth.  As you suspected, the imp is far too busy feeding to answer. You debate punishing him for his rudeness.  However, the pleasure of nursing is far too enjoyable to interrupt unnecessarily.' );
				EngineCore.outputText( '\n\nThe imp\'s belly has swollen much larger; his chest is also developing a thin layer of fat.  You wonder how much more the little beast will feed, as he moves to your fourth breast.' );
				EngineCore.outputText( '\n\nYou moan softly as the imp continues his work, although you do notice that he\'s starting to have trouble keeping up with your flow, as a fair amount of your milk has ended up on your chest and the ground, rather than the imp\'s belly.  Giving him a small swat on his bald head, you point to the milk on the ground, which causes him to whimper in apology.' );
				EngineCore.outputText( '\n\nNodding your acceptance, he continues his work much more carefully.  He\'s taking his time again instead of just sucking wildly.  You reach down curiously, and tug on the imp\'s ' + CoC.monster.cockDescriptShort( 0 ) + ' but find that it\'s shrinking.  As you hold it, it shrinks more and more. You wonder what will happen to him if he continues to nurse.' );
				//if(CoC.player has only 2 rows of breasts);
				if( CoC.player.bRows() === 2 ) {
					EngineCore.outputText( '\n\nUnfortunately it looks like you won\'t find out, as the last of your ' + Descriptors.breastDescript( 1 ) + ' runs dry.  The imp wobbles and falls over, clearly not used to the added weight.  Now that you get a good look at him, you see some very serious changes.  He\'s got a very full belly, his chest has a pair of soft male breasts, and his cock and balls have shrunk significantly.  It\'s a damn shame you ran out of milk for the creature.  It would\'ve interesting to see what happened if he\'d continued.' );
					EngineCore.outputText( '\n\nThe imp on the other hand looks a little sick to the stomach now, and flops backwards, passing out completely.  You look at him for a moment and decide he\'ll be fine.' );
				} else {
					EngineCore.outputText( '\n\nYou begin massaging your lowest row of breasts, fascinated by the idea of what will become of the imp when he milks you of all your corrupt milk.  You feel the fluid flow begin, and the imp moves on to your ' + Descriptors.breastDescript( 2 ) + '.  He nurses passionately at your ' + Descriptors.nippleDescript( 2 ) + ', slurping down every drop of your milk.' );
					EngineCore.outputText( '\n\nBefore you can even fully begin to enjoy the rest of the milking, it\'s over.  The imp takes one last, long gulp and falls backwards onto the ground.  You watch, fascinated as the imp groans loudly in discomfort. His belly gurgles and visibly shifts as if his belly was full of large worms wiggling around.  "<i>Weird.</i>" The imp begins to desperately claw at his testicles as they shrink so far that they vanish back inside of him.  The apparent itching sensation he\'s experiencing doesn\'t seem to stop however, as he begins clawing out small patches of fur, until he reveals a new, moist virgin cunt.' );
					EngineCore.outputText( '\n\nThe imp quickly penetrates his new orifice with two clawed fingers, gasping in the foreign ecstasy.  As he plays with his new tool, his former cock vanishes inside of his body, just as his testicles did.  The imp is crying out in the new found pleasure, and it seems like he\'s enjoying his new form.' );
					EngineCore.outputText( '\n\nThe gurgling of his stomach seems to have ceased, and his former muscular torso and abs are revealed again.  However his nipples are now drooling an excessive amount of milk.  The imp now appears to be a cunt-boy of some sort.  You feel yourself grow flush with arousal as the imp experiences his final changes.  Mooing loudly, the greater imp\'s new clit quickly begins to expand, growing larger and fuller the more he fingers his virgin fuck hole.' );
					EngineCore.outputText( '\n\nIt takes several minutes, but the imp reaches his orgasm. His clit is as large as an average cock (and appears to have stopped growing).  He\'s taken to using one hand to stroke off his clit like a cock, while his other hand fingers his new delicate pussy.  He moos loudly as his new fuck hole leaks its girl goo all over the ground and his hand.' );
					EngineCore.outputText( '\n\nThe imp weakly smiles at you one last time as he passes out, clearly very happy with how the events unfolded.  You\'re very pleased with the event as well.  Picking yourself up, you gather your equipment and put your [armor] back on.' );
				}
			}
			EngineCore.dynStats( 'cor', 1 );
		}
		//You've now been milked, reset the timer for that;
		CoC.player.addStatusValue( StatusAffects.Feeder, 1, 1 );
		CoC.player.changeStatusValue( StatusAffects.Feeder, 2, 0 );
		CoC.player.boostLactation( 0.1 );
		Combat.cleanupAfterCombat();
	};
	//MALE LOSE;
	ImpScene.prototype.loseToImpLord = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( ImageManager.showImage( 'implord-loss-male' ), false );
		EngineCore.outputText( 'Unable to control your lust you fall to the ground, remove your ' + CoC.player.armorName + ' and begin masturbating furiously.  The powerful imp saunters over to you smirking evilly as he towers over your fallen form. You look up at him nervously.  He grabs your chin with one of his clawed hands, while the other digs through his satchel.  He pulls out a vial filled with glowing green liquid, and pops the cork stopper off with his thumb. Before you can react, the demon forces open your mouth and pours the liquid in.  Instinct reacts faster than logic and you swallow the substance as it\'s poured down your throat.' );
		EngineCore.outputText( '\n\nYou cough and splutter, grabbing your gut, as a hot pain fills your stomach.  The imp laughs as you roll around in agony for several long moments, before the burning turns to an arousing warmth that spreads to your [hips] and [asshole].  Groaning, you feel your cheeks flush with arousal, and your eyes glaze over once more with insatiable lust.' );
		if( CoC.player.cockTotal() === 1 ) {
			EngineCore.outputText( '\n\nYou feel your ' + Descriptors.cockDescript( 0 ) + ' grow harder than usual and throb.  You go to stroke yourself but it\'s far too sensitive. Any stroking you can do is far too little stimulation and anything else is too painful to withstand.  You whimper and curse in desperation.  Your lust clouded mind can only think of one solution; you bend over and reveal your [asshole] to the grinning imp.  The humiliation keeps you from looking back to see the imp\'s reaction, but you can tell by his chuckle that this is exactly what he wanted.' );
		} else if( CoC.player.cockTotal() > 1 ) {
			EngineCore.outputText( '\n\nYou feel your ' + Descriptors.multiCockDescriptLight() + ' grow harder than usual and throb.  You go to stroke yourself but they are far too sensitive. Any stroking you can do is far too little stimulation and anything else is to painful too withstand.  You whimper and curse in desperation.  Your lust clouded mind can only think of one solution; you bend over and reveal your ' + Descriptors.assholeDescript() + ' to the grinning imp.  The humiliation keeps you from looking back to see the imp\'s reaction, but you can tell by his chuckle that this is exactly what he wanted.' );
		}
		EngineCore.outputText( '\n\nThe imp gets behind you; his corrupt presence makes the air feel heavy and hard to breathe.  You notice his satchel and loincloth get carelessly tossed to the ground.  Chancing a glance back, you look in aroused horror at the ' + CoC.monster.cockDescriptShort( 0 ) + ' between the imp\'s legs as well as his matching cum-filled balls.  Two clawed, red hands spread your [butt] revealing your [asshole].  Mercifully, the demon decides you\'ll need some form of lubrication and relaxation before he continues.  He leans forward and presses his tongue between your [butt] and begins lapping at your [asshole] viciously.  You can\'t help but mewl from the merciless attack on your tender rectum.' );
		//if(CoC.player has a vagina);
		if( CoC.player.hasVagina() ) {
			EngineCore.outputText( '\n\nThe imp takes a moment to pleasure your [vagina], forcing his tongue and two clawed fingers inside.  The claws scratch and tease painfully at your inner walls.  You mewl and cry out from the stimulation, as the imp\'s tongue moves from your [vagina] to your [clit].  You cry out in desperation as the powerful demon attacks your [clit] with his tongue.' );
		} else if( CoC.player.balls > 0 && CoC.player.hasCock() ) {
			EngineCore.outputText( '\n\nThe imp moves away from your [asshole], and begins to focus on your [balls].  He pulls one into his hand, and squeezes it cruelly while he licks and bites at your [sack].  He gives a painfully tight squeeze to the orb in his hand, which makes you cry out in painful ecstasy.  A single bead of precum gets forced out of your ' + Descriptors.cockDescript( 0 ) + '.' );
		}
		EngineCore.outputText( '\n\nThe imp finally backs off from his brutal attack on your sensitive backside.  Whatever was in that vial has made your body incredibly sensitive... each caress feels like an orgasm, and each scratch feels like a stab wound.  You hope that\'s the only effect of the green liquid, but don\'t get much chance to ponder it as you feel the muscular demon press the head of his ' + CoC.monster.cockDescriptShort( 0 ) + ' against your [asshole].' );
		EngineCore.outputText( '\n\nYou whimper in fear as you look back towards the devilish imp behind you.  He simply grins at you in response as he thrusts forward.  You yell out in pain as the ' + CoC.monster.cockDescriptShort( 0 ) + ' forces its way into your [asshole].  You try to struggle away, but the imp gives you a very rough slap on the ass.  He then roughly grabs your [hips], making sure to dig his claws in just enough to deter you from struggling.' );
		CoC.player.buttChange( CoC.monster.cockArea( 0 ), true, true, false );
		EngineCore.outputText( '\n\nThough the entry was rough, the imp\'s thrusts are incredibly gentle.  He carefully thrusts in and out of your [asshole], and even begins licking and delicately kissing your back.  The horrible stretching of your [asshole] is still incredibly painful, but made tolerable by the contrasting caresses.  You quickly lose track of time as the pain and pleasure spark across your overly sensitive body.  The imp continues to be oddly affectionate now that you\'ve fully submitted to his will.  He even releases his painful, clawed grip on your [hips].' );
		EngineCore.outputText( '\n\nAfter longer than you\'d have hoped for, the painful stretching sensation begins to disappear; and the pleasurable sensation of the imp\'s ' + CoC.monster.cockDescriptShort( 0 ) + ' thrusting in and out of your [asshole] becomes entirely pleasurable.  The way his ' + CoC.monster.cockDescriptShort( 0 ) + ' fills every inch of your ass, and rubs all your most sensitive spots.  The weird sensation his warm, demonic pre-cum coats your insides.  You find your lust-blinded mind has become lost in the sensations - so lost that you don\'t even notice the imp increasing his pace.' );
		EngineCore.outputText( '\n\nWithin moments the beast is wildly thrusting in and out of your [asshole].  Pre-cum is pumping out of his ' + CoC.monster.cockDescriptShort( 0 ) + ' like a faucet. The hot demon pre begins to spill back out of your abused [asshole], coating your [hips], and dripping to the ground beneath.  The imp gives you a few more rough thrusts before cumming hard into your [asshole].  The little demon\'s ' + CoC.monster.cockDescriptShort( 0 ) + ' spasms as he continues to roughly thrust and pump you full of his burning hot demon seed.' );
		if( CoC.player.hasCock() ) {
			EngineCore.outputText( '\n\nThe hot seed filling your belly wakes you from your lust induced daydream and you howl in discomfort.  Your belly begins to swell with the thick seed, coating every inch of your insides with the burning, arousing sensation.  This pushes you over the edge and you orgasm.  ' );
			if( CoC.player.balls > 0 ) {
				EngineCore.outputText( 'Your [balls] clench up against your body, desperate to finally expel their contents.  ' );
			}
			EngineCore.outputText( 'Your seed spills across the ground, mixing with the copious amount of demon pre that had sloshed to the ground earlier.  You howl loudly in pleasure, as you\'re finally given release.' );
		}
		EngineCore.outputText( '\n\nThe imp pulls out, but is quick to stuff a soft unknown object into your [asshole] to plug all of his delicious, corrupt seed inside of you.  You stay in position, though you\'re wobbling slightly from the intense experience.  The short, muscular demon looks down at you, and you look up at him concerned.  He chuckles, "<i>Don\'t worry my bitch, that thing will dissolve on its own in a day or so,</i>" the demon assures you.  He grips his ' + CoC.monster.cockDescriptShort( 0 ) + ', which is soaked with his own juices, and holds it out towards you.' );
		EngineCore.outputText( '\n\nYou take the hint and nervously lick the cock clean.  You can taste the corruption, and it sends sparks through your mind.  You almost wish it didn\'t have to end, but soon the imp is satisfied with your cleaning job, gathers his things and turns to leave you to recover from your ordeal.  Within minutes of him leaving you pass out, collapsing to the ground.  You lay there, in a puddle of sexual fluids for a long time before you wake up.  After gathering your equipment, you begin to make your way back to camp.  Hopefully that green stuff\'s effects will have worn off once you get back.' );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', 2, 'cor', 1 );
		CoC.player.slimeFeed();
		Combat.cleanupAfterCombat();
	};
	//FEMALE LOSE;
	ImpScene.prototype.getRapedAsAGirl = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( ImageManager.showImage( 'implord-loss-female' ), false );
		EngineCore.outputText( 'You collapse from exhaustion, your [vagina] beginning to soak your [armor].  You groan loudly, desperately trying to continue the fight, or flee, but the exhaustion is too much.  You close your eyes for a moment, but hearing a loud thud near your face causes you to painfully open your eyes.  You see a large bestial hoof near your face, while the other hoof is used to roll you onto your back.' );
		EngineCore.outputText( '\n\nYou try to move, but before you can even begin to squirm a hoof presses hard between your ' + Descriptors.breastDescript( 0 ) + '.  You gasp as the air is temporarily knocked out of your lungs.  The demon chuckles at your last feeble attempt to free yourself.  He holds his ' + CoC.monster.cockDescriptShort( 0 ) + ' stroking it lewdly, a cruel smirk stretching across his face.  You watch as several beads of pre begin to drip from his tip onto your stomach.' );
		EngineCore.outputText( '\n\nThe imp steps between your legs, gently kicking them apart, until the wet spot on your [armor] is painfully obvious.  He chuckles, and leans down, ripping your [armor] off.  He casually tosses it to the side, and leans towards your [vagina].' );
		//if(Player has balls);
		if( CoC.player.balls > 0 ) {
			EngineCore.outputText( '\n\nThe imp pulls your [balls] up, revealing your [vagina].  Unceremoniously, he presses his lips towards your crotch forcing his tongue into your [vagina], making you gasp in pleasure.  He gives your [balls] a rough squeeze, making your [vagina] even wetter than it was.  The imp moans in delight, licking up all your girl juices.' );
		} else {
			EngineCore.outputText( '\n\nThe imp roughly forces his tongue into your [vagina] making you gasp in pleasure.  Your [vagina] clenches around the demonic tongue, squirting some of your girl juices around the wet flesh as it delves deeper into you.  You writhe and squirm trying to fight against the forced pleasure.' );
		}
		EngineCore.outputText( '\n\nYou mewl pitifully as the imp removes his tongue. He smirks at your [vagina] and kneels' );
		if( CoC.player.isBiped() ) {
			EngineCore.outputText( ' between your legs' );
		} else {
			EngineCore.outputText( ' before you' );
		}
		EngineCore.outputText( ', draping his ' + CoC.monster.cockDescriptShort( 0 ) + ' across your wet crotch.  You groan, and unintentionally thrust against the magnificent tool between your legs.  The imp chuckles evilly as you coat his ' + CoC.monster.cockDescriptShort( 0 ) + ' in your girl juice, but he doesn\'t wait long before he slowly presses his head down against your [vagina].  His head slowly spreads your lips; the pleasure is unmistakable, and forces a loud moan from your lips.' );
		EngineCore.outputText( '\n\nWith a soft pop, the ' + CoC.monster.cockDescriptShort( 0 ) + ' pops into your [vagina], and both of you moan in unison, the demon beginning to thrust wildly into you.  His hips pumps back and forth into you.  The loud slapping sound of flesh on flesh echoes around you, drowning out the grunts of the vicious demon above you.' );
		CoC.player.cuntChange( CoC.monster.cockArea( 0 ), true, true, false );
		EngineCore.outputText( '\n\nYou mewl softly as you\'re viciously fucked by the beast above you.  It doesn\'t take long before your [vagina] clenches tightly around the ' + CoC.monster.cockDescriptShort( 0 ) + ' as you orgasm.  You scream in pleasure as your inner walls begin to milk the imp\'s ' + CoC.monster.cockDescriptShort( 0 ) + ' of its seed.  The imp quickly succumbs and cums, his swollen balls tightening up against his crotch.  The hot jizz continues to pump into you for what feels like several painfully long minutes, until your belly bulges slightly, and your ' + Descriptors.vaginaDescript( 0 ) + ' begins to leak the white demonic fluid.' );
		EngineCore.outputText( '\n\nThe imp pulls out, and gives himself a few final strokes, sending one last shot of cum across your face.  You blush in embarrassment and wipe the sticky seed from your nose and lips.  Standing up, the imp presses a hoof down hard on your distended stomach, making you gasp loudly as the demon\'s thick cum is forced back out of your [vagina], pooling between your legs. The imp gives a satisfied smirk and flies off, leaving you to clean up.' );
		EngineCore.outputText( '\n\nYou stand up weakly after several moments, and gather your [armor].  It takes you a while to get dressed in your defeated state, but you manage to crawl back towards your camp.  Your [vagina] is still leaking some of the demonic cum, but you try not to worry about it as you arrive, collapsing almost immediately.' );
		CoC.player.orgasm();
		EngineCore.dynStats( 'cor', 1 );
		CoC.player.slimeFeed();
		Combat.cleanupAfterCombat();
	};
	ImpScene.prototype.putBeeEggsInAnImpYouMonster = function() {
		EngineCore.clearOutput();
		//IMP EGGS;
		//(functions for bipedal bee morphs.  At time of writing, unsure as to whether bee abdomen worked for centaur/naga/goo forms);
		EngineCore.outputText( ImageManager.showImage( 'imp-egg' ), false );
		EngineCore.outputText( 'You glance down at the masturbating imp, feeling a twitch in your swollen, insectile abdomen.  As the red-skinned homunculus writhes on the ground, beating his meat, you smile, feeling a globule of sweet nectar oozing out of your ovipositor.' );
		EngineCore.outputText( '\n\nHe’s too busy humping the air and stroking himself to notice you hooking the tip of one of your [feet] under him.  You kick up one of your [legs], flipping the fapping imp over.  He gasps as he lands face-down on the ground, startled enough to stop jerking his tool.' );
		EngineCore.outputText( '\n\nYou grin, straddling his surprisingly perky ass, resting your [hips] on his small, round cheeks.  With your arms pinning down his shoulders, he can’t stroke himself, and he whimpers at the restraint.' );
		EngineCore.outputText( '\n\n"<i>Wait - what’s going on?</i>" he gasps.' );
		EngineCore.outputText( '\n\nYou deign not to answer him, lost in the unique sensation of your abdomen curling behind you.  You toss your head back, luxuriating in the pleasure of your black ovipositor emerging against smooth, glossy skin of the imp’s ass.' );
		EngineCore.outputText( '\n\n"<i>No, nooooooo...</i>" whimpers the imp as you bite your lip, pushing the tip of your organ into his surprisingly pliant hole.' );
		EngineCore.outputText( '\n\nYou and the imp shudder in tandem as your sweet honey smears between his cheeks, oozing down his crack as you squeeze your throbbing ovipositor further and further into him.  Buried deep in his bowels, you feel the first of your eggs push through your rubbery organ, stretching out your tube along with his asshole.' );
		EngineCore.outputText( '\n\nAs you lay your first egg inside the imp, he gurgles, face-down against the ground, and you feel him tighten around your ovipositor.  The imp wriggles beneath your body and by the slowly-spreading pool of steaming cum; you guess that he just climaxed.' );
		EngineCore.outputText( '\n\nThe imp pants, trying to catch his breath as you twitch your abdomen, adjusting your ovipositor inside him.  Before he can recover, you push another egg down your tube, implanting it deep in the imp alongside the first egg.' );
		EngineCore.outputText( '\n\n"<i>Suh-stop...</i>" groans the imp even as you push a third egg into his tiny body.  But you’re beyond stopping.  Egg after egg, you fill his twitching body.  The pool of cum grows, and it oozes around your ' );
		if( CoC.player.isGoo() ) {
			EngineCore.outputText( 'rippled goo edges' );
		} else if( CoC.player.isNaga() ) {
			EngineCore.outputText( 'trembling coils' );
		} else {
			EngineCore.outputText( 'straddling knees' );
		}
		EngineCore.outputText( ' as you turn the imp into your own, private incubator.' );
		EngineCore.outputText( '\n\nAfter a handful of eggs, you grunt, realizing that you’ve run out of room inside the imp.  Tilting your head to one side, you consider that the imp is face-down, and that his stomach might need more room to stretch.  You rise halfway up and flip him over beneath you, careful to leave your ovipositor still buried inside him.' );
		EngineCore.outputText( '\n\nThe imp’s eyes are almost completely rolled back in his head, his flat chest smothered with his own spunk.  His breathing is ragged, and his hard, massive cock is slathered with thick, white cum.  His belly already bulges slightly with your eggs and his small hands move to clutch at his stomach, giving him the look of a debased, pregnant mother.' );
		EngineCore.outputText( '\n\nThat realization is enough to stimulate your ovipositor again.  With a groan, you plant your hands on the ground to either side of his head, on your knees as your ovipositor pumps another egg into the imp’s bowels.  The imp shudders as his belly swells, filling with your brood.' );
		EngineCore.outputText( '\n\n"<i>More... more!</i>" moans the imp beneath you.  You oblige, and ' );
		if( CoC.player.biggestTitSize() >= 1 ) {
			EngineCore.outputText( 'his tiny claws grab your ' );
			if( CoC.player.bRows() > 1 ) {
				EngineCore.outputText( 'first row of ' );
			}
			EngineCore.outputText( Descriptors.breastDescript( 0 ) + ', squeezing your tits as you fuck him full.' );
			if( CoC.player.lactationQ() >= 500 ) {
				EngineCore.outputText( '  Rivulets of your milk run down his forearms as he inexpertly milks you.' );
			}
		}
		//[If cock: ;
		else if( CoC.player.hasCock() ) {
			EngineCore.outputText( 'the rise of his swollen belly soon presses against [oneCock] and the rhythm of your thrusts strokes his shiny red stomach against your sensitive organ.' );
		} else if( CoC.player.hasVagina() ) {
			EngineCore.outputText( 'the imp’s tiny, clawed feet scrabble against you as he flails in pleasure.  By mistake, one slips between the lips of your pussy, small toes wriggling against your inner walls, and you instinctively push down against the small limb, fucking yourself with his foot.' );
		} else {
			EngineCore.outputText( 'you feel a firm pressure at your [asshole] as the tip of the imp’s lashing tail prods frantically against you, manically shoving in and out of your [asshole].' );
		}

		EngineCore.outputText( '\n\nYou groan, climaxing against the imp, just as he lets out another gout of hot seed from his cum-smeared dick.  He spatters your front, his spunk mingling with your fluids, shuddering as he takes the last of your eggs inside him, his belly swollen to the size of a beach ball.' );
		EngineCore.outputText( '\n\nYou pant heavily, and with a messy squelching, you pull yourself out of the imp, pushing yourself up from your crouched position.  A gush of honey pours from the imp’s ass, cutting off quickly as an egg rolls into place from the inside, stopping up your imp-cubator.' );
		EngineCore.outputText( '\n\nYou hear a strange noise from the imp, one that sounds strangely like a giggle.  You glance down at him, instinctively evaluating him as a bearer of your eggs.  The imp is still panting, looking up at you from under his messy, black hair.  With a flushed, submissive expression and swollen, pregnant belly, the imp seems almost... cute?  He cradles his massive, egg-filled belly, caressing it, then looks back to you, blushing.' );
		EngineCore.outputText( '\n\nYou blink then stand up.  You shake your head as you walk away, chalking the odd thoughts up to your egg-laying instincts.  Some of these mutations have some weird effects, after all...' );
		CoC.player.orgasm();
		EngineCore.dynStats( 'sen', -1 );
		CoC.player.dumpEggs();
		Combat.cleanupAfterCombat();
	};
	SceneLib.registerScene( 'impScene', new ImpScene() );
} );