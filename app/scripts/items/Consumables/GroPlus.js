'use strict';

angular.module( 'cocjs' ).factory( 'GroPlus', function( SceneLib, CoC, Utils, Consumable, EngineCore ) {
	function GroPlus() {
		this.init(this, arguments);
	}
	angular.extend(GroPlus.prototype, Consumable.prototype);
	GroPlus.prototype.init = function( that ) {
		Consumable.prototype.init( that, [ 'GroPlus', 'GroPlus', 'a needle filled with Gro+', 50, 'This is a small needle with a reservoir full of blue liquid.  A faded label marks it as \'GroPlus\'.  Its purpose seems obvious.' ] );
		that.classNames.push('GroPlus');
	};
	GroPlus.prototype.canUse = function() {
		return true;
	};
	GroPlus.prototype.useItem = function() {
		var gpBalls = (CoC.player.balls > 0 ? this.growPlusBalls : null);
		var gpBreasts = (CoC.player.breastRows.length > 0 ? this.growPlusBreasts : null);
		var gpClit = (CoC.player.vaginas.length > 0 ? this.growPlusClit : null);
		var gpCock = (CoC.player.cockTotal() > 0 ? this.growPlusCock : null);
		var gpNipples = (CoC.player.totalNipples() > 0 ? this.growPlusNipples : null);
		EngineCore.clearOutput();
		EngineCore.outputText( 'You ponder the needle in your hand knowing it will enlarge the injection site.  What part of your body will you use it on?  ' );
		EngineCore.choices( 'Balls', gpBalls, 'Breasts', gpBreasts, 'Clit', gpClit, 'Cock', gpCock, 'Nipples', gpNipples, '', null, '', null, '', null, '', null, 'Nevermind', this.growPlusCancel );
		return (true);
	};
	GroPlus.prototype.growPlusBalls = function() {
		EngineCore.clearOutput();
		CoC.player.slimeFeed();
		EngineCore.outputText( 'You sink the needle deep into your ' + CoC.player.sackDescript() + '.  It hurts like hell, but you push down the plunger and the pain vanishes as the needles contents flow into you.\n\n' );
		//1 in 4 BIG growth.;
		if( Utils.rand( 4 ) === 0 ) {
			EngineCore.outputText( 'You feel a trembling in your ' + CoC.player.ballsDescriptLight() + ' as the chemicals start to go to work.  You can tell they\'re going to be VERY effective.\n' );
			CoC.player.ballSize += Utils.rand( 4 ) + 2;
			EngineCore.outputText( 'They shift, stretching your ' + CoC.player.sackDescript() + ' tight as they gain inches of size.  You step to steady yourself as your center of balance shifts due to your newly enlarged ' + CoC.player.ballsDescriptLight() + '.  ' );
		} else {
			CoC.player.ballSize += Utils.rand( 2 ) + 1;
			EngineCore.outputText( 'You feel your testicles shift, pulling the skin of your ' + CoC.player.sackDescript() + ' a little bit as they grow to ' + CoC.player.ballsDescriptLight() + '.  ' );
		}
		if( CoC.player.ballSize > 10 ) {
			EngineCore.outputText( 'Walking gets even tougher with the swollen masses between your legs.  Maybe this was a bad idea.' );
		}
		EngineCore.dynStats( 'lus', 10 );
		SceneLib.inventory.itemGoNext();
	};
	GroPlus.prototype.growPlusBreasts = function() {
		EngineCore.clearOutput();
		CoC.player.slimeFeed();
		EngineCore.outputText( 'You sink the needle into the flesh of your ' + CoC.player.allBreastsDescript() + ' injecting each with a portion of the needle.\n\n' );
		if( CoC.player.breastRows.length === 1 ) {
			CoC.player.growTits( Utils.rand( 5 ) + 1, 1, true, 1 );
		} else {
			CoC.player.growTits( Utils.rand( 2 ) + 1, CoC.player.breastRows.length, true, 1 );
		}
		EngineCore.dynStats( 'lus', 10 );
		SceneLib.inventory.itemGoNext();
	};
	GroPlus.prototype.growPlusClit = function() {
		EngineCore.clearOutput();
		CoC.player.slimeFeed();
		EngineCore.outputText( 'You sink the needle into your clit, nearly crying with how much it hurts.  You push down the plunger and the pain vanishes as your clit starts to grow.\n\n' );
		CoC.player.clitLength++;
		EngineCore.outputText( 'Your ' + CoC.player.clitDescript() + ' stops growing after an inch of new flesh surges free of your netherlips.  It twitches, feeling incredibly sensitive.' );
		EngineCore.dynStats( 'sen', 2, 'lus', 10 );
		SceneLib.inventory.itemGoNext();
	};
	GroPlus.prototype.growPlusCock = function() {
		EngineCore.clearOutput();
		CoC.player.slimeFeed();
		EngineCore.outputText( 'You sink the needle into the base of your ' + CoC.player.multiCockDescriptLight() + '.  It hurts like hell, but as you depress the plunger, the pain vanishes, replaced by a tingling pleasure as the chemicals take effect.\n\n' );
		if( CoC.player.cocks.length === 1 ) {
			EngineCore.outputText( 'Your ' + CoC.player.cockDescript( 0 ) + ' twitches and thickens, pouring more than an inch of thick new length from your ' );
			CoC.player.increaseCock( 0, 4 );
			CoC.player.cocks[ 0 ].cockLength += 1; // This was forcing 'what was said' to match 'what actually happened' no matter what increase/growCock /actually/ did.
			CoC.player.cocks[ 0 ].cockThickness += 0.5; // And growCock never actually touched thickness. Nor does the new version. Thickness mod was stripped out entirely.
		}
		//MULTI;
		else {
			EngineCore.outputText( 'Your ' + CoC.player.multiCockDescriptLight() + ' twitch and thicken, each member pouring out more than an inch of new length from your ' );
			for( var i = 0; i < CoC.player.cocks.length; i++ ) {
				CoC.player.increaseCock( i, 2 );
				CoC.player.cocks[ i ].cockLength += 1;
				CoC.player.cocks[ i ].cockThickness += 0.5;
			}
		}
		if( CoC.player.hasSheath() ) {
			EngineCore.outputText( 'sheath.' );
		} else {
			EngineCore.outputText( 'crotch.' );
		}
		EngineCore.dynStats( 'sen', 2, 'lus', 10 );
		SceneLib.inventory.itemGoNext();
	};
	GroPlus.prototype.growPlusNipples = function() {
		EngineCore.clearOutput();
		CoC.player.slimeFeed();
		EngineCore.outputText( 'You sink the needle into each of your ' + CoC.player.nippleDescript( 0 ) + 's in turn, dividing the fluid evenly between them.  Though each injection hurts, the pain is quickly washed away by the potent chemical cocktail.\n\n' );
		//Grow nipples;
		EngineCore.outputText( 'Your nipples engorge, prodding hard against the inside of your ' + CoC.player.armorName + '.  Abruptly you realize they\'ve grown more than an additional quarter-inch.\n\n' );
		CoC.player.nippleLength += (Utils.rand( 2 ) + 3) / 10;
		EngineCore.dynStats( 'lus', 15 );
		//NIPPLECUNTZZZ;
		if( !CoC.player.hasFuckableNipples() && Utils.rand( 4 ) === 0 ) {
			var nowFuckable = false;
			for( var x = 0; x < CoC.player.breastRows.length; x++ ) {
				if( !CoC.player.breastRows[ x ].fuckable && CoC.player.nippleLength >= 2 ) {
					CoC.player.breastRows[ x ].fuckable = true;
					nowFuckable = true;
				}
			}
			//Talk about if anything was changed.;
			if( nowFuckable ) {
				EngineCore.outputText( 'Your ' + CoC.player.allBreastsDescript() + ' tingle with warmth that slowly migrates to your nipples, filling them with warmth.  You pant and moan, rubbing them with your fingers.  A trickle of wetness suddenly coats your finger as it slips inside the nipple.  Shocked, you pull the finger free.  <b>You now have fuckable nipples!</b>\n\n' );
			}
		}
		SceneLib.inventory.itemGoNext();
	};
	GroPlus.prototype.growPlusCancel = function() {
		EngineCore.clearOutput();
		EngineCore.outputText( 'You put the vial away.\n\n' );
		SceneLib.inventory.returnItemToInventory( this );
	};
	return GroPlus;
} );