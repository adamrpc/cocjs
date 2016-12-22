'use strict';

angular.module( 'cocjs' ).factory( 'StatsView', function($log, CoC) {
	function StatsView( mainView ) {
		if( !mainView ) {
			return;
		}
		this.mainView = mainView;
		this.stats = {};
		var that = this;
		_.forEach([ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'lust', 'fatigue', 'HP', 'level', 'XP', 'coreStats', 'gems', 'time' ], function(statType) {
			that.stats[statType] = {};
			that.stats[statType].text = _.capitalize(statType);
			that.stats[statType].num = -1;
			that.stats[statType].bar = -1;
			that.stats[statType].up = false;
			that.stats[statType].down = false;
		});
	}
	// <- statsScreenRefresh
	StatsView.prototype.refresh = function() {
		this.stats.coreStats.text = '<b><u>Name : {NAME}</b>'
			.replace( '{NAME}', CoC.player.short );
		this.stats.time.text = "<b><u>Day #: {DAYS}</u></b>\n<b>Time : {HOURS}:00</b>"
			.replace( "{DAYS}", CoC.time.days )
			.replace( "{HOURS}", CoC.time.hours );
		var that = this;
		_.forEach( [ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'fatigue', 'lust' ], function( statName ) {
			that.stats[statName].bar = CoC.player[statName] / 100;
			that.stats[statName].num = CoC.player[statName];
		} );
		this.stats.HP.bar = CoC.player.HP / CoC.player.maxHP();
		this.stats.HP.num = CoC.player.HP;
		this.stats.level.num = CoC.player.level;
		this.stats.XP.num = CoC.player.XP;
		this.stats.gems.num = CoC.player.gems;
	};
	// <- showStats
	StatsView.prototype.show = function() {
		// make all the stats DOs visible.
		this.refresh();
		this.visible = true;
	};
	// <- hideStats
	StatsView.prototype.hide = function() {
		this.visible = false;
	};
	// <- hideUpDown
	StatsView.prototype.hideUpDown = function() {
		var that = this;
		_.forEach( [ 'str', 'tou', 'spe', 'inte', 'lib', 'sens', 'cor', 'lust', 'fatigue', 'HP', 'XP' ], function( statName ) {
			$log.debug(statName, that.stats[statName], that.stats);
			that.stats[statName].up = false;
			that.stats[statName].down = false;
		} );
		this.mainView.hideLevelUp();
	};
	StatsView.prototype.showUpDown = function() {
		var that = this;
		_.forOwn( CoC.oldStats, function( value, statName ) {
			if( CoC.player[ statName ] > CoC.oldStats[ statName ] ) {
				that.showStatUp( statName );
			}
			if( CoC.player[ statName ] < CoC.oldStats[ statName ] ) {
				that.showStatDown( statName );
			}
		} );
	};
	StatsView.prototype.showStatUp = function( statName ) {
		this.stats[statName].up = true;
		this.stats[statName].down = false;
	};
	StatsView.prototype.showStatDown = function( statName ) {
		this.stats[statName].up = false;
		this.stats[statName].down = true;
	};
	return StatsView;
} );