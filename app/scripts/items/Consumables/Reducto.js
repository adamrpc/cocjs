'use strict';

angular.module( 'cocjs' ).factory( 'Reducto', function( CockTypesEnum, CoC, Utils, Consumable, EngineCore ) {
	var Reducto = angular.copy( Consumable );
	Reducto.prototype.init = function( that ) {
		Consumable.prototype.init( that, [ 'Reducto', 'Reducto', 'a salve marked as \'Reducto\'', 30, 'This container full of paste can be used to shrink a body part down by a significant amount.' ] );
	};
	Reducto.prototype.canUse = function() {
		return true;
	};
	Reducto.prototype.useItem = function() {
		var rdtBalls = (CoC.getInstance().player.balls > 0 && CoC.getInstance().player.ballSize > 1 ? this.reductoBalls : null);
		var rdtBreasts = (CoC.getInstance().player.breastRows.length > 0 && CoC.getInstance().player.biggestTitSize() > 0 ? this.reductoBreasts : null);
		var rdtButt = (CoC.getInstance().player.buttRating > 1 ? this.reductoButt : null);
		var rdtClit = (CoC.getInstance().player.vaginas.length > 0 && CoC.getInstance().player.clitLength > 0.25 ? this.reductoClit : null);
		var rdtCock = (CoC.getInstance().player.cockTotal() > 0 && CoC.getInstance().player.biggestCockArea() > 6 ? this.reductoCock : null);
		var rdtHips = (CoC.getInstance().player.hipRating > 2 ? this.reductoHips : null);
		var rdtNipples = (CoC.getInstance().player.nippleLength > 0.25 ? this.reductoNipples : null);
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ponder the paste in your hand and wonder what part of your body you would like to shrink.  What will you use it on?' );
		EngineCore.choices( 'Balls', rdtBalls, 'Breasts', rdtBreasts, 'Butt', rdtButt, 'Clit', rdtClit, 'Cock', rdtCock,
			'Hips', rdtHips, 'Nipples', rdtNipples, '', null, '', null, 'Nevermind', this.reductoCancel );
		return (true);
	};
	Reducto.prototype.reductoBalls = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You smear the foul-smelling paste onto your ' + CoC.getInstance().player.sackDescript() + '.  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n' );
		CoC.getInstance().player.ballSize -= Utils.rand( 4 ) + 2;
		if( CoC.getInstance().player.ballSize < 1 ) {
			CoC.getInstance().player.ballSize = 1;
		}
		EngineCore.outputText( 'You feel your scrotum shift, shrinking down along with your ' + CoC.getInstance().player.ballsDescriptLight() + '.  Within a few seconds the paste has been totally absorbed and the shrinking stops.' );
		EngineCore.dynStats( 'lib', -2, 'lus', -10 );
		CoC.getInstance().inventory.itemGoNext();
	};
	Reducto.prototype.reductoBreasts = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You smear the foul-smelling ointment all over your ' + CoC.getInstance().player.allBreastsDescript() + ', covering them entirely as the paste begins to get absorbed into your ' + CoC.getInstance().player.skinDesc + '.\n' );
		CoC.getInstance().player.shrinkTits( true );
		if( Utils.rand( 2 ) === 0 && CoC.getInstance().player.biggestTitSize() >= 1 ) {
			EngineCore.outputText( '\nThe effects of the paste continue to manifest themselves, and your body begins to change again...' );
			CoC.getInstance().player.shrinkTits( true );
		}
		EngineCore.outputText( '\nThe last of it wicks away into your skin, completing the changes.' );
		EngineCore.dynStats( 'sen', -2, 'lus', -5 );
		CoC.getInstance().inventory.itemGoNext();
	};
	Reducto.prototype.reductoButt = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You smear the foul-smelling paste onto your ' + CoC.getInstance().player.buttDescript() + '.  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n' );
		if( CoC.getInstance().player.buttRating >= 15 ) {
			CoC.getInstance().player.buttRating -= (3 + Math.ceil( CoC.getInstance().player.buttRating / 3 ));
			EngineCore.outputText( 'Within seconds you feel noticeably lighter, and a quick glance shows your ass is significantly smaller.' );
		} else if( CoC.getInstance().player.buttRating >= 10 ) {
			CoC.getInstance().player.buttRating -= 3;
			EngineCore.outputText( 'You feel much lighter as your ' + CoC.getInstance().player.buttDescript() + ' jiggles slightly, adjusting to its smaller size.' );
		} else {
			CoC.getInstance().player.buttRating -= Utils.rand( 3 ) + 1;
			if( CoC.getInstance().player.buttRating < 1 ) {
				CoC.getInstance().player.buttRating = 1;
			}
			EngineCore.outputText( 'After a few seconds your ' + CoC.getInstance().player.buttDescript() + ' has shrunk to a much smaller size!' );
		}
		EngineCore.dynStats( 'lib', -2, 'lus', -10 );
		CoC.getInstance().inventory.itemGoNext();
	};
	Reducto.prototype.reductoClit = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You carefully apply the paste to your ' + CoC.getInstance().player.clitDescript() + ', being very careful to avoid getting it on your ' + CoC.getInstance().player.vaginaDescript( 0 ) + '.  It burns with heat as it begins to make its effects known...\n\n' );
		CoC.getInstance().player.clitLength /= 1.7;
		//Set clitlength down to 2 digits in length;
		CoC.getInstance().player.clitLength = Math.ceil( CoC.getInstance().player.clitLength * 100 ) / 100;
		EngineCore.outputText( 'Your ' + CoC.getInstance().player.clitDescript() + ' shrinks rapidly, dwindling down to almost half its old size before it finishes absorbing the paste.' );
		EngineCore.dynStats( 'sen', 2, 'lus', 10 );
		CoC.getInstance().inventory.itemGoNext();
	};
	Reducto.prototype.reductoCock = function() {
		EngineCore.clearOutput();
		if( CoC.getInstance().player.cocks[ 0 ].cockType === CockTypesEnum.BEE ) {
			EngineCore.outputText( 'The gel produces an odd effect when you rub it into your ' + CoC.getInstance().player.cockDescript( 0 ) + '.  It actually seems to calm the need that usually fills you.  In fact, as your ' + CoC.getInstance().player.cockDescript( 0 ) + ' shrinks, its skin tone changes to be more in line with yours and the bee hair that covered it falls out.  <b>You now have a human cock!</b>' );
			CoC.getInstance().player.cocks[ 0 ].cockType = CockTypesEnum.HUMAN;
		} else {
			EngineCore.outputText( 'You smear the repulsive smelling paste over your ' + CoC.getInstance().player.multiCockDescriptLight() + '.  It immediately begins to grow warm, almost uncomfortably so, as your ' + CoC.getInstance().player.multiCockDescriptLight() + ' begins to shrink.\n\n' );
			if( CoC.getInstance().player.cocks.length === 1 ) {
				EngineCore.outputText( 'Your ' + CoC.getInstance().player.cockDescript( 0 ) + ' twitches as it shrinks, disappearing steadily into your ' + (CoC.getInstance().player.hasSheath() ? 'sheath' : 'crotch') + ' until it has lost about a third of its old size.' );
				CoC.getInstance().player.cocks[ 0 ].cockLength *= 2 / 3;
				CoC.getInstance().player.cocks[ 0 ].cockThickness *= 2 / 3;
			} else {
				{ //MULTI
				}
				EngineCore.outputText( 'Your ' + CoC.getInstance().player.multiCockDescriptLight() + ' twitch and shrink, each member steadily disappearing into your ' + (CoC.getInstance().player.hasSheath() ? 'sheath' : 'crotch') + ' until they\'ve lost about a third of their old size.' );
				for( var i = 0; i < CoC.getInstance().player.cocks.length; i++ ) {
					CoC.getInstance().player.cocks[ i ].cockLength *= 2 / 3;
					CoC.getInstance().player.cocks[ i ].cockThickness *= 2 / 3;
				}
			}
		}
		EngineCore.dynStats( 'sen', -2, 'lus', -10 );
		CoC.getInstance().inventory.itemGoNext();
	};
	Reducto.prototype.reductoHips = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You smear the foul-smelling paste onto your [hips].  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n' );
		if( CoC.getInstance().player.hipRating >= 15 ) {
			CoC.getInstance().player.hipRating -= (3 + Math.ceil( CoC.getInstance().player.hipRating / 3 ));
			EngineCore.outputText( 'Within seconds you feel noticeably lighter, and a quick glance at your hips shows they\'ve gotten significantly narrower.' );
		} else if( CoC.getInstance().player.hipRating >= 10 ) {
			CoC.getInstance().player.hipRating -= 3;
			EngineCore.outputText( 'You feel much lighter as your [hips] shift slightly, adjusting to their smaller size.' );
		} else {
			CoC.getInstance().player.hipRating -= Utils.rand( 3 ) + 1;
			if( CoC.getInstance().player.hipRating < 1 ) {
				CoC.getInstance().player.hipRating = 1;
			}
			EngineCore.outputText( 'After a few seconds your [hips] have shrunk to a much smaller size!' );
		}
		EngineCore.dynStats( 'lib', -2, 'lus', -10 );
		CoC.getInstance().inventory.itemGoNext();
	};
	Reducto.prototype.reductoNipples = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You rub the paste evenly over your ' + CoC.getInstance().player.nippleDescript( 0 ) + 's, being sure to cover them completely.\n\n' );
		//Shrink;
		if( CoC.getInstance().player.nippleLength / 2 < 0.25 ) {
			EngineCore.outputText( 'Your nipples continue to shrink down until they stop at 1/4" long.' );
			CoC.getInstance().player.nippleLength = 0.25;
		} else {
			EngineCore.outputText( 'Your ' + CoC.getInstance().player.nippleDescript( 0 ) + 's get smaller and smaller, stopping when they are roughly half their previous size.' );
			CoC.getInstance().player.nippleLength /= 2;
		}
		EngineCore.dynStats( 'sen', -5, 'lus', -5 );
		CoC.getInstance().inventory.itemGoNext();
	};
	Reducto.prototype.reductoCancel = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You put the salve away.\n\n' );
		CoC.getInstance().inventory.returnItemToInventory( this );
	};
	return Reducto;
} );