'use strict';

angular.module( 'cocjs' ).factory( 'EncapsulationPod', function( SceneLib, WeightedDrop, WeaponLib, Descriptors, AppearanceDefs, CoC, Monster, StatusAffects ) {
	function EncapsulationPod() {
		this.init(this, arguments);
	}
	angular.extend(EncapsulationPod.prototype, Monster.prototype);
	EncapsulationPod.prototype.performCombatAction = function() {
		SceneLib.dungeon2Supplimental.encapsulationPodAI();
	};
	EncapsulationPod.prototype.defeated = function() {
		SceneLib.dungeon2Supplimental.encapsulationVictory();
	};
	EncapsulationPod.prototype._getLong = function() {
		//[Round 1 Description];
		var _long;
		if( this.findStatusAffect( StatusAffects.Round ) < 0 ) {
			_long = 'You\'re totally trapped inside a pod!  The walls are slimy and oozing moisture that makes the air sickeningly sweet.  It makes you feel a little dizzy.  Tentacles are climbing up your ' + CoC.player.legs() + ' towards your crotch, doing their best to get under you ' + CoC.player.armorName + '.  There\'s too many to try to pull away.  Your only chance of escape is to create a way out!';
		}//[Round 2 Description];
		else if( this.statusAffectv1( StatusAffects.Round ) === 2 ) {
			_long = 'You\'re still trapped inside the pod!  By now the walls are totally soaked with some kind of viscous slime.  The smell of it is unbearably sweet and you have to put a hand against the wall to steady yourself.  Warm tentacles are curling and twisting underneath your armor, caressing every ';
			if( CoC.player.skinType === AppearanceDefs.SKIN_TYPE_FUR ) {
				_long += 'furry ';
			}
			if( CoC.player.skinType === AppearanceDefs.SKIN_TYPE_SCALES ) {
				_long += 'scaley ';
			}
			_long += 'inch of your ' + CoC.player.legs() + ', crotch, and ' + Descriptors.assDescript() + '.';
		}
		//[Round 3 Description];
		else if( this.statusAffectv1( StatusAffects.Round ) === 3 ) {
			_long = 'You\'re trapped inside the pod and being raped by its many tentacles!   The pooling slime is constantly rising, and in a few moments it will have reached your groin.  The viscous sludge makes it hard to move and the smell of it is making it even harder to think or stand up.  The tentacles assaulting your groin don\'t stop moving for an instant, and in spite of yourself, some part of you wants them to make you cum quite badly.';
		}
		//[Round 4 Description];
		else {
			_long = 'You\'re trapped inside the pod and being violated by tentacles from the shoulders down!  The slime around your waist is rising even faster now.  It will probably reach ';
			if( CoC.player.biggestTitSize() >= 1 ) {
				_long += 'the underside of your ' + Descriptors.allBreastsDescript();
			} else {
				_long += 'your chest';
			}
			_long += ' in moments.  You\'re being fucked by a bevy of tentacles while your nipples are ';
			if( !CoC.player.hasFuckableNipples() ) {
				_long += 'fondled ';
			} else {
				_long += 'fucked ';
			}
			_long += 'by more of the slippery fungal protrusions.  It would be so easy to just relax back in the fluid and let it cradle you while you\'re pleasured.  You barely even smell the sweet, thought-killing scent from before, but your hips are rocking on their own and you stumble every time you try to move.  Your resistance is about to give out!';
		}
		//[DAMAGE DESCRIPTS – Used All Rounds];
		//[Greater than 80% Life];
		if( this.HPRatio() > 0.8 ) {
			_long += '  The pulsing luminescence continues to oscillate in a regular rhythm.  You haven\'t done enough damage to the thing to affect it in the slightest.';
		}
		//[Greater than 60% Life];
		else if( this.HPRatio() > 0.6 ) {
			_long += '  Your attacks have turned a part of the wall a sickly black color, and it no longer glows along with the rest of your chamber.';
		}
		//[Greater than 40% Life] ;
		else if( this.HPRatio() > 0.4 ) {
			_long += '  You\'ve dented the wall with your attacks.  It\'s permanently deformed and bruised solid black from your struggles.  Underneath the spongy surface you can feel a rock-solid core that\'s beginning to give.';
		}
		//Greater than 20% Life] ;
		else if( this.HPRatio() > 0.2 ) {
			_long += '  You have to blink your eyes constantly because the capsule\'s bio-luminescent lighting is going nuts.  The part of the wall you\'re going after is clearly dead, but the rest of your fungal prison is flashing in a crazy, panicked fashion.';
		}
		//[Greater than 0% Life];
		else {
			_long += '  You can see light through the fractured wall in front of you!  One more solid strike should let you escape!';
		}
		return _long;
	};
	EncapsulationPod.prototype.init = function( that, args ) {
		Monster.prototype.init( that, args );
		that.classNames.push('EncapsulationPod');
		that.a = 'the ';
		that.short = 'pod';
		that.imageName = 'pod';
		that.long = '';
		that.initGenderless();
		that.createBreastRow( 0, 0 );
		that.tallness = 120;
		that.hipRating = AppearanceDefs.HIP_RATING_SLENDER;
		that.buttRating = AppearanceDefs.BUTT_RATING_BUTTLESS;
		that.skinTone = 'purple';
		that.skinType = AppearanceDefs.SKIN_TYPE_PLAIN;
		that.skinDesc = 'covering';
		that.hairColor = 'black';
		that.hairLength = 0;
		that.initStrTouSpeInte( 90, 1, 1, 1 );
		that.initLibSensCor( 1, 1, 100 );
		that.weaponName = 'pod';
		that.weaponVerb = 'pod';
		that.armorName = 'pod';
		that.bonusHP = 450;
		that.lust = 10;
		that.lustVuln = 0;
		that.temperment = Monster.TEMPERMENT_RANDOM_GRAPPLES;
		that.level = 12;
		that.gems = 1;
		that.additionalXP = 80;
		that.drop = new WeightedDrop( WeaponLib.JRAPIER, 1 );
		that.special1 = null;
		that.special2 = null;
		that.special3 = null;
		that.checkMonster();
	};
	var EncapsulationPodProxy = new Proxy( EncapsulationPod, {
		construct: function( target ) {
			return new Proxy( new target(), {
				get: function( target, name ) {
					if(_.has(target.prototype, name)) {
						return target.prototype[name];
					}
					if( name === 'long' ) {
						return target._getLong();
					}
					return target[ name ];
				},
				set: function( target, name, value ) {
					target[ name ] = value;
					return true;
				}
			} );
		}
	} );
	return EncapsulationPodProxy;
} );