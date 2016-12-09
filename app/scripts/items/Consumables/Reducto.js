'use strict';

angular.module( 'cocjs' ).run( function( ConsumableLib, SceneLib, CockTypesEnum, CoC, Utils, Useable, EngineCore ) {
	function Reducto() {
		this.init(this, arguments);
	}
	angular.extend(Reducto.prototype, Useable.prototype);
	Reducto.prototype.init = function( that ) {
		Useable.prototype.init( that, [ 'Reducto', 'Reducto', 'a salve marked as \'Reducto\'', 30, 'This container full of paste can be used to shrink a body part down by a significant amount.' ] );
		that.classNames.push('Reducto');
	};
	Reducto.prototype.canUse = function() {
		return true;
	};
	Reducto.prototype.useItem = function() {
		var rdtBalls = (CoC.player.balls > 0 && CoC.player.ballSize > 1 ? this.reductoBalls : null);
		var rdtBreasts = (CoC.player.breastRows.length > 0 && CoC.player.biggestTitSize() > 0 ? this.reductoBreasts : null);
		var rdtButt = (CoC.player.buttRating > 1 ? this.reductoButt : null);
		var rdtClit = (CoC.player.vaginas.length > 0 && CoC.player.clitLength > 0.25 ? this.reductoClit : null);
		var rdtCock = (CoC.player.cockTotal() > 0 && CoC.player.biggestCockArea() > 6 ? this.reductoCock : null);
		var rdtHips = (CoC.player.hipRating > 2 ? this.reductoHips : null);
		var rdtNipples = (CoC.player.nippleLength > 0.25 ? this.reductoNipples : null);
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ponder the paste in your hand and wonder what part of your body you would like to shrink.  What will you use it on?' );
		EngineCore.choices( 'Balls', this, rdtBalls, 'Breasts', this, rdtBreasts, 'Butt', this, rdtButt, 'Clit', this, rdtClit, 'Cock', this, rdtCock,
			'Hips', this, rdtHips, 'Nipples', this, rdtNipples, '', null, null, '', null, null, 'Nevermind', this, this.reductoCancel );
		return (true);
	};
	Reducto.prototype.reductoBalls = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You smear the foul-smelling paste onto your ' + CoC.player.sackDescript() + '.  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n' );
		CoC.player.ballSize -= Utils.rand( 4 ) + 2;
		if( CoC.player.ballSize < 1 ) {
			CoC.player.ballSize = 1;
		}
		EngineCore.outputText( 'You feel your scrotum shift, shrinking down along with your ' + CoC.player.ballsDescriptLight() + '.  Within a few seconds the paste has been totally absorbed and the shrinking stops.' );
		EngineCore.dynStats( 'lib', -2, 'lus', -10 );
		SceneLib.inventory.itemGoNext();
	};
	Reducto.prototype.reductoBreasts = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You smear the foul-smelling ointment all over your ' + CoC.player.allBreastsDescript() + ', covering them entirely as the paste begins to get absorbed into your ' + CoC.player.skinDesc + '.\n' );
		CoC.player.shrinkTits( true );
		if( Utils.rand( 2 ) === 0 && CoC.player.biggestTitSize() >= 1 ) {
			EngineCore.outputText( '\nThe effects of the paste continue to manifest themselves, and your body begins to change again...' );
			CoC.player.shrinkTits( true );
		}
		EngineCore.outputText( '\nThe last of it wicks away into your skin, completing the changes.' );
		EngineCore.dynStats( 'sen', -2, 'lus', -5 );
		SceneLib.inventory.itemGoNext();
	};
	Reducto.prototype.reductoButt = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You smear the foul-smelling paste onto your ' + CoC.player.buttDescript() + '.  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n' );
		if( CoC.player.buttRating >= 15 ) {
			CoC.player.buttRating -= (3 + Math.ceil( CoC.player.buttRating / 3 ));
			EngineCore.outputText( 'Within seconds you feel noticeably lighter, and a quick glance shows your ass is significantly smaller.' );
		} else if( CoC.player.buttRating >= 10 ) {
			CoC.player.buttRating -= 3;
			EngineCore.outputText( 'You feel much lighter as your ' + CoC.player.buttDescript() + ' jiggles slightly, adjusting to its smaller size.' );
		} else {
			CoC.player.buttRating -= Utils.rand( 3 ) + 1;
			if( CoC.player.buttRating < 1 ) {
				CoC.player.buttRating = 1;
			}
			EngineCore.outputText( 'After a few seconds your ' + CoC.player.buttDescript() + ' has shrunk to a much smaller size!' );
		}
		EngineCore.dynStats( 'lib', -2, 'lus', -10 );
		SceneLib.inventory.itemGoNext();
	};
	Reducto.prototype.reductoClit = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You carefully apply the paste to your ' + CoC.player.clitDescript() + ', being very careful to avoid getting it on your ' + CoC.player.vaginaDescript( 0 ) + '.  It burns with heat as it begins to make its effects known...\n\n' );
		CoC.player.clitLength /= 1.7;
		//Set clitlength down to 2 digits in length;
		CoC.player.clitLength = Math.ceil( CoC.player.clitLength * 100 ) / 100;
		EngineCore.outputText( 'Your ' + CoC.player.clitDescript() + ' shrinks rapidly, dwindling down to almost half its old size before it finishes absorbing the paste.' );
		EngineCore.dynStats( 'sen', 2, 'lus', 10 );
		SceneLib.inventory.itemGoNext();
	};
	Reducto.prototype.reductoCock = function() {
		EngineCore.clearOutput();
		if( CoC.player.cocks[ 0 ].cockType === CockTypesEnum.BEE ) {
			EngineCore.outputText( 'The gel produces an odd effect when you rub it into your ' + CoC.player.cockDescript( 0 ) + '.  It actually seems to calm the need that usually fills you.  In fact, as your ' + CoC.player.cockDescript( 0 ) + ' shrinks, its skin tone changes to be more in line with yours and the bee hair that covered it falls out.  <b>You now have a human cock!</b>' );
			CoC.player.cocks[ 0 ].cockType = CockTypesEnum.HUMAN;
		} else {
			EngineCore.outputText( 'You smear the repulsive smelling paste over your ' + CoC.player.multiCockDescriptLight() + '.  It immediately begins to grow warm, almost uncomfortably so, as your ' + CoC.player.multiCockDescriptLight() + ' begins to shrink.\n\n' );
			if( CoC.player.cocks.length === 1 ) {
				EngineCore.outputText( 'Your ' + CoC.player.cockDescript( 0 ) + ' twitches as it shrinks, disappearing steadily into your ' + (CoC.player.hasSheath() ? 'sheath' : 'crotch') + ' until it has lost about a third of its old size.' );
				CoC.player.cocks[ 0 ].cockLength *= 2 / 3;
				CoC.player.cocks[ 0 ].cockThickness *= 2 / 3;
			} else {
				{ //MULTI
				}
				EngineCore.outputText( 'Your ' + CoC.player.multiCockDescriptLight() + ' twitch and shrink, each member steadily disappearing into your ' + (CoC.player.hasSheath() ? 'sheath' : 'crotch') + ' until they\'ve lost about a third of their old size.' );
				for( var i = 0; i < CoC.player.cocks.length; i++ ) {
					CoC.player.cocks[ i ].cockLength *= 2 / 3;
					CoC.player.cocks[ i ].cockThickness *= 2 / 3;
				}
			}
		}
		EngineCore.dynStats( 'sen', -2, 'lus', -10 );
		SceneLib.inventory.itemGoNext();
	};
	Reducto.prototype.reductoHips = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You smear the foul-smelling paste onto your [hips].  It feels cool at first but rapidly warms to an uncomfortable level of heat.\n\n' );
		if( CoC.player.hipRating >= 15 ) {
			CoC.player.hipRating -= (3 + Math.ceil( CoC.player.hipRating / 3 ));
			EngineCore.outputText( 'Within seconds you feel noticeably lighter, and a quick glance at your hips shows they\'ve gotten significantly narrower.' );
		} else if( CoC.player.hipRating >= 10 ) {
			CoC.player.hipRating -= 3;
			EngineCore.outputText( 'You feel much lighter as your [hips] shift slightly, adjusting to their smaller size.' );
		} else {
			CoC.player.hipRating -= Utils.rand( 3 ) + 1;
			if( CoC.player.hipRating < 1 ) {
				CoC.player.hipRating = 1;
			}
			EngineCore.outputText( 'After a few seconds your [hips] have shrunk to a much smaller size!' );
		}
		EngineCore.dynStats( 'lib', -2, 'lus', -10 );
		SceneLib.inventory.itemGoNext();
	};
	Reducto.prototype.reductoNipples = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You rub the paste evenly over your ' + CoC.player.nippleDescript( 0 ) + 's, being sure to cover them completely.\n\n' );
		//Shrink;
		if( CoC.player.nippleLength / 2 < 0.25 ) {
			EngineCore.outputText( 'Your nipples continue to shrink down until they stop at 1/4" long.' );
			CoC.player.nippleLength = 0.25;
		} else {
			EngineCore.outputText( 'Your ' + CoC.player.nippleDescript( 0 ) + 's get smaller and smaller, stopping when they are roughly half their previous size.' );
			CoC.player.nippleLength /= 2;
		}
		EngineCore.dynStats( 'sen', -5, 'lus', -5 );
		SceneLib.inventory.itemGoNext();
	};
	Reducto.prototype.reductoCancel = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You put the salve away.\n\n' );
		SceneLib.inventory.returnItemToInventory( this );
	};
	ConsumableLib.registerConsumable( 'REDUCTO', new Reducto() );
} );