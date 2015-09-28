/* jQuery-Mobile-DateBox */

/* CORE Functions */

(function( $ ) {

	$.widget( "jtsage.datebox", {
		initSelector: "input[data-role='datebox']",
		options: {
			// All widget options, including some internal runtime details

			// 3-jQueryMobileVersion
			// Check Header for Build Date.
			version: "4.0.0",
			// These are never used, just information
			jqmVersion: "1.4.5",
			bootstrapVersion: "3.3.5",

			theme: false,
			themeDefault: "a",
			themeHeader: "a",
			themeSetButton: "a",
			themeCloseButton: false,
			mode: false,

			transition: "fade",
			useAnimation: true,
			hideInput: false,
			hideContainer: false,

			lockInput: true,

			zindex: "1100",
			clickEvent: "vclick",
			clickEventAlt: "click",

			defaultValue: false,
			showInitialValue: false,

			linkedField: false,
			linkedFieldFormat: "%J",

			popupPosition: false,
			popupButtonPosition: "left",
			popupForceX: false,
			popupForceY: false,

			useModal: true,
			useModalTheme: "b",
			useInline: false,
			useInlineBlind: false,
			useHeader: true,
			useImmediate: false,

			useButton: true,
			buttonIcon: false,
			useFocus: false,
			useClearButton: false,
			useCollapsedBut: false,
			usePlaceholder: false,

			beforeOpenCallback: false,
			beforeOpenCallbackArgs: [],
			openCallback: false,
			openCallbackArgs: [],
			closeCallback: false,
			closeCallbackArgs: [],

			startOffsetYears: false,
			startOffsetMonths: false,
			startOffsetDays: false,
			afterToday: false,
			beforeToday: false,
			notToday: false,
			maxDays: false,
			minDays: false,
			maxYear: false,
			minYear: false,
			blackDates: false,
			blackDatesRec: false,
			blackDays: false,
			whiteDates: true,
			minHour: false,
			maxHour: false,
			minTime: false,
			maxTime: false,
			maxDur: false,
			minDur: false,
			minuteStep: 1,
			minuteStepRound: 0,

			rolloverMode: { 
				"m": true,
				"d": true,
				"h": true,
				"i": true,
				"s": true
			},

			useLang: "default",
			lang: {
				"default" : {
					setDateButtonLabel: "Set Date",
					setTimeButtonLabel: "Set Time",
					setDurationButtonLabel: "Set Duration",
					calTodayButtonLabel: "Jump to Today",
					calTomorrowButtonLabel: "Jump to Tomorrow",
					titleDateDialogLabel: "Set Date",
					titleTimeDialogLabel: "Set Time",
					daysOfWeek: [
						"Sunday", "Monday", "Tuesday", 
						"Wednesday", "Thursday", "Friday", 
						"Saturday"
					],
					daysOfWeekShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
					monthsOfYear: [
						"January", "February", "March", "April", "May", "June",
						"July", "August", "September", "October", "November", "December"
					],
					monthsOfYearShort: [
						"Jan", "Feb", "Mar", "Apr", "May", "Jun",
						"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
					],
					durationLabel: ["Days", "Hours", "Minutes", "Seconds"],
					durationDays: ["Day", "Days"],
					timeFormat: 24,
					headerFormat: "%A, %B %-d, %Y",
					tooltip: "Open Date Picker",
					nextMonth: "Next Month",
					prevMonth: "Previous Month",
					dateFieldOrder: ["m", "d", "y"],
					timeFieldOrder: ["h", "i", "a"],
					slideFieldOrder: ["y", "m", "d"],
					dateFormat: "%Y-%m-%d",
					useArabicIndic: false,
					isRTL: false,
					calStartDay: 0,
					clearButton: "Clear",
					cancelButton: "Cancel",
					durationOrder: ["d", "h", "i", "s"],
					meridiem: ["AM", "PM"],

					// 12HR: "%l:%M %p"
					// 24HR: "%k:%M" 
					timeOutput: "%k:%M", 
					durationFormat: "%Dd %DA, %Dl:%DM:%DS",
					calDateListLabel: "Other Dates",
					calHeaderFormat: "%B %Y"
				}
			}
		},
		_enhanceDate: function() {
			$.extend(this._date.prototype, {
				copy: function( adjust, override ) {
					// Get a modified copy of the date.
					// First array - Offset the new date by #  
					//    (position determines date part)
					// Second array - If non-zero, force the new date by # 
					//    (position determines date part)
					
					adjust = $.extend( [0,0,0,0,0,0,0], adjust );
					override = $.extend( [0,0,0,0,0,0,0], override );
					return new Date(
						((override[0] > 0 ) ? override[0] : this.get(0) + adjust[0]),
						((override[1] > 0 ) ? override[1] : this.get(1) + adjust[1]),
						((override[2] > 0 ) ? override[2] : this.get(2) + adjust[2]),
						((override[3] > 0 ) ? override[3] : this.get(3) + adjust[3]),
						((override[4] > 0 ) ? override[4] : this.get(4) + adjust[4]),
						((override[5] > 0 ) ? override[5] : this.get(5) + adjust[5]),
						((override[6] > 0 ) ? override[5] : this.get(6) + adjust[6]));
				},
				adj: function (type, amount) {
					// Adjust the date.  Yes, this is chainable 
					if ( typeof amount !== "number" || typeof type !== "number" ) {
						throw new Error( "Invalid Arguments" );
					}
					switch ( type ) {
						case 0: this.setD( 0, this.get(0) + amount ); break;
						case 1: this.setD( 1, this.get(1) + amount ); break;
						case 2: this.setD( 2, this.get(2) + amount ); break;
						case 3: amount *= 60;
							/* falls through */
						case 4: amount *= 60;
							/* falls through */
						case 5: amount *= 1000;
							/* falls through */
						case 6: this.setTime( this.getTime() + amount ); break;
					}
					return this;
				},
				setD: function(type, amount) {
					// A chainable version of setWhatever() 
					switch ( type ) {
						case 0: this.setFullYear(amount); break;
						case 1: this.setMonth(amount); break;
						case 2: this.setDate(amount); break;
						case 3: this.setHours(amount); break;
						case 4: this.setMinutes(amount); break;
						case 5: this.setSeconds(amount); break;
						case 6: this.setMilliseconds(amount); break;
					}
					return this;
				},
				get: function(type) {
					// Chainable version of get. Also shorter.
					switch ( type ) {
						case 0: return this.getFullYear();
						case 1: return this.getMonth();
						case 2: return this.getDate();
						case 3: return this.getHours();
						case 4: return this.getMinutes();
						case 5: return this.getSeconds();
						case 6: return this.getMilliseconds();
					}
					return false;
				},
				get12hr: function() {
					if ( this.get(3) === 0 ) { return 12; }
					if ( this.get(3) < 13 ) { return this.get(3); }
					return this.get(3) - 12;
				},
				iso: function() {
					var arr = [0,0,0], i = 0;
					for ( i=0; i < 3; i++ ) {
						arr[ i ] = this.get( i );
						if ( i === 1 ) { arr[ i ]++; }
						if ( arr[i] < 10 ) { arr[ i ] = "0" + String( arr[ i ] ); }
					}
					return arr.join( "-" );
				},
				comp: function () {
					return parseInt( this.iso().replace( /-/g, "" ), 10 );
				},
				getEpoch: function() {
					return Math.floor( this.getTime() / 1000);
				},
				getArray: function() {
					var arr = [0,0,0,0,0,0], i = 0;
					for ( i = 0; i < 6; i++ ) {
						arr[i] = this.get(i);
					}
					return arr;
				},
				setFirstDay: function (day) {
					// Grabs first valid (day) of current month
					this.setD( 2, 1 ).adj( 2, ( day - this.getDay() ) );
					if ( this.get( 2 ) > 10 ) { this.adj( 2, 7 ); }
					return this;
				},
				setDWeek: function (type,num) {
					if ( type === 4 ) {
						return this.setD(1,0).setD(2,1).setFirstDay(4).adj(2,-3).adj(2,(num-1)*7);
					}
					return this.setD(1,0).setD(2,1).setFirstDay(type).adj(2,(num-1)*7);
				},
				getDWeek: function (type) {
					var t1, t2;

					switch ( type ) {
						case 0:
							t1 = this.copy([0,-1*this.getMonth()]).setFirstDay(0);
							return Math.floor(
								( this.getTime() - ( t1.getTime() + (
									( this.getTimezoneOffset() - t1.getTimezoneOffset() ) * 60000
								))) / 6048e5 ) + 1;
						case 1:
							t1 = this.copy([0,-1*this.getMonth()]).setFirstDay(1);
							return Math.floor(
								( this.getTime() - ( t1.getTime() + (
									( this.getTimezoneOffset() - t1.getTimezoneOffset() ) * 60000
								))) / 6048e5 ) + 1;
						case 4:
							// this line is some bullshit.  but it does work.
							// (trap for dec 29, 30, or 31st being in the new year's week - these
							// are the only 3 that can possibly fall like this)
							if ( this.getMonth() === 11 && this.getDate() > 28 ) { return 1; }

							t1 = this.copy([0,-1*this.getMonth()],true).setFirstDay(4).adj(2,-3);
							t2 = Math.floor(
								( this.getTime() - ( t1.getTime() + (
									( this.getTimezoneOffset() - t1.getTimezoneOffset() ) * 60000
								))) / 6048e5 ) + 1;

							if ( t2 < 1 ) {
								t1 = this.copy([-1,-1*this.getMonth()]).setFirstDay(4).adj(2,-3);
								return Math.floor((this.getTime() - t1.getTime()) / 6048e5) + 1;
							}
							return t2;
						default:
							return 0;
					}
				}
			});
		},
		_event: function(e, p) {
			var tmp,
				w = $( this ).data( "jtsage-datebox" ),
				o = $( this ).data( "jtsage-datebox" ).options;


			if ( ! e.isPropagationStopped() ) {
				switch (p.method) {
					case "close":
						if ( typeof p.closeCancel === "undefined" ) { p.closeCancel = false; }
						w.cancelClose = p.closeCancel;
						w.close();
						break;
					case "open":
						w.open(); break;
					case "set":
						if ( typeof p.value === "object" ) {
							w.theDate = p.value;
							w._t( { method: "doset" } );
						} else {
							$( this ).val( p.value );
							if ( o.linkedField !== false ) {
								$( o.linkedField )
									.val( w.callFormat( o.linkedFieldFormat, w.theDate, false ) );
							}
							$( this ).trigger( "change" );
						}
						break;
					case "doset":
						tmp = "_" + w.options.mode + "DoSet";
						if ( $.isFunction( w[ tmp ] ) ) {
							w[ tmp ].apply( w, [] );
						} else {
							w._t( { 
								method: "set",
								value: w._formatter( w.__fmt(), w.theDate ),
								date: w.theDate
							} );
						}
						break;
					case "dooffset":
						if ( p.type ) { 
							w._offset( p.type, p.amount, true );
						} 
						break;
					case "dorefresh":
						w.refresh();
						break;
					case "doclear":
						$( this ).val( "" ).trigger( "change" );
						break;
					case "clear":
						$( this ).trigger( "change" );
						break;
				}
			}
		},
		_ord: {
			"default": function (num) {
				// Return an ordinal suffix (1st, 2nd, 3rd, etc)
				var ending = num % 10;
				if ( ( num > 9 && num < 21 ) || ending > 3 ) { return "th"; }
				return [ "th", "st", "nd", "rd" ][ ending ];
			}
		},
		_dur: function(ms) {
			var dur = [
					ms / ( 60*60*1000*24 ),
					ms / ( 60*60*1000) % 24,
					ms / ( 60*1000) % 60,
					ms / ( 1000 ) % 60,
				];
			$.each(dur, function(a,b){
				if ( b < 0 ) { 
					dur[a] = 0;
				} else { 
					dur[a] = Math.floor(b);
				}
			});
			return dur;
		},
		_gridblk: {
			g: [0, 0, "a", "b", "c", "d", "e"],
			b: ["a", "b", "c", "d", "e", "f"]
		},
		__ : function(val) {
			var o = this.options,
				lang = o.lang[o.useLang],
				mode = o[ o.mode + "lang"],
				oride = "override" + val.charAt(0).toUpperCase() + val.slice(1);

			if ( typeof o[ oride ] !== "undefined" ) {
				return o[ oride ]; 
			}
			if ( typeof lang !== "undefined" && typeof lang[ val ] !== "undefined" ) {
				return lang[ val ];
			}
			if ( ( typeof mode !== "undefined" ) && ( typeof mode[ val ] !== "undefined" ) ) { 
				return mode[ val ]; 
			}
			return o.lang[ "default" ][ val ];
		},
		__fmt: function() {
			var w = this,
				o = this.options;

			if ( typeof w.fmtOver !== "undefined" && w.fmtOver !== false ) {
				return w.fmtOver;
			}
			
			switch ( o.mode ) {
				case "timebox":
				case "timeflipbox":
					return w.__( "timeOutput" );
				case "durationbox":
				case "durationflipbox":
					return w.__( "durationFormat" );
				default:
					return w.__( "dateFormat" );
			}
		},
		_zPad: function(number, pad) {
			// Zero pad a number.
			if ( typeof pad !== "undefined" && pad === "-" ) { return String(number); }
			return ( number < 10  ? "0" : "" ) + String( number );
		},
		_dRep: function( oper, direction ) {
			// Digit replacement Indic/Arabic
			var ch, i, 
				start = 48,
				end = 57,
				adder = 1584,
				newd = "";

			if ( direction === -1 ) {
				start += adder;
				end += adder;
				adder = -1584;
			}
			for ( i = 0; i < oper.length; i++ ) {
				ch = oper.charCodeAt( i );
				if ( ch >= start && ch <= end ) {
					newd = newd + String.fromCharCode( ch+adder );
				} else {
					newd = newd + String.fromCharCode( ch );
				}
			}
			return newd;
		},
		_doIndic: function() {
			var w = this;

			w.d.intHTML.find( "*" ).each( function() {
				if ( $( this ).children().length < 1 ) {
					$( this ).text( w._dRep( $( this ).text() ) );
				} else if ( $( this ).hasClass( "ui-datebox-slideday" ) ) {
					$( this ).html( w._dRep( $( this ).html() ) );
				}
			});
			w.d.intHTML.find( "input" ).each(function() {
				$( this ).val( w._dRep( $( this ).val() ) );
			});
		},
		_parser: {
			// Custom Parser Definitions.
			"default": function () { return false; } // Arguments is STR
		},
		_n: function ( val, def ) {
			// Don't allow negative values, use a default instead
			return ( val < 0 ) ? def : val;
		},
		_pa: function (arr,date) {
			// "Clean" a date for use.
			if ( typeof date === "boolean" ) { 
				return new this._date( arr[0], arr[1], arr[2], 0, 0, 0, 0 );
			}
			return new this._date( 
				date.get(0),
				date.get(1),
				date.get(2),
				arr[0],
				arr[1],
				arr[2],
				0
			);
		},
		_makeDate: function ( str ) {
			// Date Parser
			var i,  exp_temp, exp_format, grbg,
				w = this,
				o = this.options,
				defVal = this.options.defaultValue,
				adv = w.__fmt(),
				exp_input = null,
				exp_names = [],
				date = new w._date(),
				d = { 
					year: -1,
					mont: -1,
					date: -1,
					hour: -1,
					mins: -1,
					secs: -1,
					week: false,
					wtyp: 4,
					wday: false,
					yday: false,
					meri: 0
				};
			
			str = $.trim( ( ( w.__( "useArabicIndic" ) === true && typeof str !== "undefined" ) ? 
					w._dRep( str, -1 ) : 
					str 
				) );

			if ( typeof o.mode === "undefined" ) { return date; }
			if ( typeof w._parser[ o.mode ] !== "undefined" ) { 
				return w._parser[ o.mode ].apply( w, [ str ] ); 
			}

			if ( o.mode === "durationbox" || o.mode === "durationflipbox" ) {
				adv = adv.replace(/%D([a-z])/gi, function( match, oper ) {
					switch ( oper ) {
						case "d":
						case "l":
						case "M":
						case "S": return "(" + match + "|[0-9]+)";
						default: return ".+?";
					}
				});

				adv = new RegExp( "^" + adv + "$" );
				exp_input = adv.exec(str);
				exp_format = adv.exec(w.__fmt());

				if ( exp_input === null || exp_input.length !== exp_format.length ) {
					if ( typeof defVal === "number" && defVal > 0 ) {
						// defaultValue is an integer
						return new w._date(
							( w.initDate.getEpoch() + parseInt( defVal,10 ) ) * 1000
						);
					}
					// No default, use ZERO.
					return new w._date( w.initDate.getTime() );
				}

				exp_temp = w.initDate.getEpoch();
				for ( i=1; i<exp_input.length; i++ ) {
					grbg = parseInt( exp_input[i], 10);

					if ( exp_format[i].match( /^%Dd$/i ) ) { 
						exp_temp = exp_temp + ( grbg * 86400 );
					}
					if ( exp_format[i].match( /^%Dl$/i ) ) { 
						exp_temp = exp_temp + ( grbg * 3600 );
					}
					if ( exp_format[i].match( /^%DM$/i ) ) { 
						exp_temp = exp_temp + ( grbg * 60 );
					}
					if ( exp_format[i].match( /^%DS$/i ) ) { 
						exp_temp = exp_temp + ( grbg ); 
					}
				}
				return new w._date( exp_temp * 1000 );
			}

			if ( adv === "%J" ) { 
				date = new w._date(str);
				if ( isNaN(date.getDate()) ) { date = new w._date(); }
				return date;
			}

			adv = adv.replace( /%(0|-)*([a-z])/gi, function( match, pad, oper ) {
				exp_names.push( oper );
				switch ( oper ) {
					case "p":
					case "P":
					case "b":
					case "B": return "(" + match + "|.+?)";
					case "H":
					case "k":
					case "I":
					case "l":
					case "m":
					case "M":
					case "S":
					case "V":
					case "U":
					case "u":
					case "W":
					case "d": 
						return "(" + match + "|[0-9]{" + 
							(( pad === "-" ) ? "1," : "" ) + "2})";
					case "j": return "(" + match + "|[0-9]{3})";
					case "s": return "(" + match + "|[0-9]+)";
					case "g":
					case "y": return "(" + match + "|[0-9]{2})";
					case "E":
					case "G":
					case "Y": return "(" + match + "|[0-9]{1,4})";
					default: exp_names.pop(); return ".+?";
				}
			});

			adv = new RegExp( "^" + adv + "$" );
			exp_input = adv.exec(str);
			exp_format = adv.exec(w.__fmt());

			if ( exp_input === null || exp_input.length !== exp_format.length ) {
				if ( defVal !== false && defVal !== "" ) {
					switch ( typeof defVal ) {
						case "object":
							if ( $.isFunction( defVal.getDay ) ) {
								date = defVal;
							} else {
								if ( defVal.length === 3 ) {
									date =  w._pa(
										defVal,
										( o.mode.substr(0,4) === "time" ? date : false )
									);
								}
							} 
							break;
						case "number":
							date =  new w._date( defVal * 1000 ); break;
						case "string":
							if ( o.mode.substr(0,4) === "time" ) {
								exp_temp = $.extend(
										[0,0,0],
										defVal.split( ":" )
									).slice( 0, 3 );
								date = w._pa( exp_temp, date ); 
							} else {
								exp_temp = $.extend( 
										[0,0,0],
										defVal.split( "-" )
									).slice( 0, 3 );
								exp_temp[1]--;
								date = w._pa( exp_temp, false ); 
							} break;
					}
				}
				if ( isNaN(date.getDate()) ) { date = new w._date(); }
			} else {
				for ( i=1; i<exp_input.length; i++ ) {
					grbg = parseInt( exp_input[i], 10);
					switch ( exp_names[i-1] ) {
						case "s": return new w._date( parseInt( exp_input[i], 10 ) * 1000 );
						case "Y":
						case "G": d.year = grbg; break;
						case "E": d.year = grbg - 543; break;
						case "y":
						case "g":
							if ( o.afterToday || grbg < 38 ) {
								d.year = 2000 + grbg;
							} else {
								d.year = 1900 + grbg;
							} break;
						case "m": d.mont = grbg - 1; break;
						case "d": d.date = grbg; break;
						case "H":
						case "k":
						case "I":
						case "l": d.hour = grbg; break;
						case "M": d.mins = grbg; break;
						case "S": d.secs = grbg; break;
						case "u": d.wday = grbg - 1; break;
						case "w": d.wday = grbg; break;
						case "j": d.yday = grbg; break;
						case "V": d.week = grbg; d.wtyp = 4; break;
						case "U": d.week = grbg; d.wtyp = 0; break;
						case "W": d.week = grbg; d.wtyp = 1; break;
						case "p":
						case "P": 
							grbg = new RegExp("^" + exp_input[i] + "$", "i");
							d.meri = ( grbg.test( w.__( "meridiem" )[0] ) ? -1 : 1 );
							break;
						case "b":
							exp_temp = $.inArray( exp_input[i], w.__( "monthsOfYearShort" ) );
							if ( exp_temp > -1 ) { d.mont = exp_temp; }
							break;
						case "B":
							exp_temp = $.inArray( exp_input[i], w.__( "monthsOfYear" ) );
							if ( exp_temp > -1 ) { d.mont = exp_temp; }
							break;
					}
				}
				if ( d.meri !== 0 ) {
					if ( d.meri === -1 && d.hour === 12 ) { d.hour = 0; }
					if ( d.meri === 1 && d.hour !== 12 ) { d.hour = d.hour + 12; }
				}

				date = new w._date(
					w._n( d.year, 0 ),
					w._n( d.mont, 0 ),
					w._n( d.date, 1 ),
					w._n( d.hour, 0 ),
					w._n( d.mins, 0 ),
					w._n( d.secs, 0 ),
					0
				);

				if ( d.year < 100 && d.year !== -1 ) { date.setFullYear(d.year); }

				if ( ( d.mont > -1 && d.date > -1 ) ||
						( d.hour > -1 && d.mins > -1 && d.secs > -1 ) ) {
					return date;
				}

				if ( d.week !== false ) {
					date.setDWeek( d.wtyp, d.week );
					if ( d.date > -1 ) { date.setDate( d.date ); }
				}
				if ( d.yday !== false ) { 
					date.setD( 1, 0 ).setD( 2, 1 ).adj( 2, ( d.yday - 1 ) );
				}
				if ( d.wday !== false ) { 
					date.adj( 2 , ( d.wday - date.getDay() ) );
				}
			}
			return date;
		},
		_customformat: {
			"default": function() { return false; } // Arguments are OPER, DATE
		},
		_formatter: function(format, date, allowArIn) {
			var w = this,
				o = this.options, tmp,
				dur = 0;

				if ( typeof(allowArIn) === "undefined" ) { allowArIn = true; }

				if ( o.mode.substr( 0, 4 ) === "dura" ) {
					dur = w._dur(this.theDate.getTime() - this.initDate.getTime());

					if ( ! format.match( /%Dd/ ) ) { dur[1] += (dur[0]*24);}
					if ( ! format.match( /%Dl/ ) ) { dur[2] += (dur[1]*60);}
					if ( ! format.match( /%DM/ ) ) { dur[3] += (dur[2]*60);}
				}

			format = format.replace(/%(D|X|0|-)*([1-9a-zA-Z])/g, function(match, pad, oper) {
				if ( pad === "X" ) {
					if ( typeof w._customformat[o.mode] !== "undefined" ) { 
						return w._customformat[o.mode](oper, date, o);
					}
					return match;
				}
				if ( pad === "D" ) {
					switch ( oper ) {
						case "d": return dur[0];
						case "l": return w._zPad(dur[1]);
						case "M": return w._zPad(dur[2]);
						case "S": return w._zPad(dur[3]);
						case "A": return w.__( "durationDays" )[ (( dur[0] === 1 ) ? 0 : 1 ) ];
						default: return match;
					}
				}
				switch ( oper ) {
					case "a": // Short Day
						return w.__( "daysOfWeekShort" )[ date.getDay() ];
					case "A": // Full Day of week
						return w.__( "daysOfWeek" )[ date.getDay() ];
					case "b": // Short month
						return w.__( "monthsOfYearShort" )[ date.getMonth() ];
					case "B": // Full month
						return w.__( "monthsOfYear" )[ date.getMonth() ];
					case "C": // Century
						return parseInt(date.getFullYear() / 100);
					case "d": // Day of month
						return w._zPad( date.getDate(), pad );
					case "H": // Hour (01..23)
					case "k":
						return w._zPad( date.getHours(), pad );
					case "I": // Hour (01..12)
					case "l":
						return w._zPad( date.get12hr(), pad );
					case "m": // Month
						return w._zPad( date.getMonth()+1, pad );
					case "M": // Minutes
						return w._zPad( date.getMinutes(), pad );
					case "p": // AM/PM (ucase)
					case "P": // AM/PM (lcase)
						tmp = w.__( "meridiem" )[ ( ( date.get(3) < 12 ) ? 0 : 1 ) ].toUpperCase();
						return ( oper === "P" ? tmp.toLowerCase() : tmp );
					case "s": // Unix Seconds
						return date.getEpoch();
					case "S": // Seconds
						return w._zPad( date.getSeconds(), pad );
					case "u": // Day of week (1-7)
						return w._zPad( date.getDay() + 1, pad );
					case "w": // Day of week
						return date.getDay();
					case "y": // Year (2 digit)
						return w._zPad(date.getFullYear() % 100);
					case "Y": // Year (4 digit)
						return date.getFullYear();
					case "E": // BE (Buddist Era, 4 Digit)
						return date.getFullYear() + 543;
					case "V":
						return w._zPad( date.getDWeek(4), pad );
					case "U":
						return w._zPad( date.getDWeek(0), pad );
					case "W":
						return w._zPad( date.getDWeek(1), pad );
					case "o": // Ordinals
						if ( typeof w._ord[o.useLang] !== "undefined" ) {
							return w._ord[ o.useLang ]( date.getDate() );
						}
						return w._ord[ "default" ](date.getDate());
					case "j":
						tmp = new Date(date.getFullYear(),0,1);
						tmp = "000" + String(Math.ceil((date - tmp) / 86400000)+1);
						return tmp.slice(-3);
					case "J":
						return date.toJSON();
					case "G":
						tmp = date.getFullYear();
						if ( date.getDWeek(4) === 1 && date.getMonth() > 0 ) {
							return tmp + 1;
						}
						if ( date.getDWeek(4) > 51 && date.getMonth() < 11 ) {
							return tmp - 1;
						}
						return tmp;
					case "g":
						tmp = date.getFullYear % 100;
						if ( date.getDWeek(4) === 1 && date.getMonth() > 0 ) {
							++tmp;
						}
						if ( date.getDWeek(4) > 51 && date.getMonth() < 11 ) {
							--tmp;
						}
						return w._zpad(tmp);
					default:
						return match;
				}
			});

			if ( w.__( "useArabicIndic" ) === true && allowArIn === true ) {
				format = w._dRep(format);
			}

			return format;
		},
		_btwn: function(value, low, high) {
			return ( value > low && value < high );
		},
		_minStepFix: function() {
			// Round "extra" minutes when using a stepper.
			var newMinute = this.theDate.get(4), 
				mstep = this.options.minuteStep,
				roundDirection = this.options.minStepRound,
				remainder = newMinute % mstep;

			if ( mstep > 1 && remainder > 0 ) {
				if ( roundDirection < 0 ) {
					newMinute = newMinute - remainder;
				} else if ( roundDirection > 0 ) {
					newMinute = newMinute + ( mstep - remainder );
				} else {
					if ( newMinute % mstep < mstep / 2 ) {
						newMinute = newMinute - remainder;
					} else {
						newMinute = newMinute + ( mstep - remainder );
					}
				}
			this.theDate.setMinutes(newMinute);
			}
		},
		_offset: function(mode, amount, update) {
			// Compute a date/time offset.
			//   update = false to prevent controls refresh
			var w = this,
				o = this.options,
				now = this.theDate,
				ok = false;

			mode = ( mode || "" ).toLowerCase();

			if ( typeof update === "undefined" ) { update = true; }

			if ( mode !== "a" && 
					( typeof o.rolloverMode[mode] === "undefined" || o.rolloverMode[mode] === true )
				) {
				ok = $.inArray(mode, [ "y", "m", "d", "h", "i", "s" ]);
			} else {
				switch(mode) {
					case "y": ok = 0; break;
					case "m":
						if ( w._btwn( now.get(1) + amount, -1, 12 ) ) { ok = 1; }
						break;
					case "d":
						if ( w._btwn( 
								now.get(2) + amount, 
								0, 
								( 32 - now.copy( [0], [0,0,32,13] ).get(3) + 1 ) 
							)) { ok = 2; }
						break;
					case "h":
						if ( w._btwn( now.get(3) + amount, -1, 24 ) ) { ok = 3; }
						break;
					case "i":
						if ( w._btwn( now.get(4) + amount, -1, 60 ) ) { ok = 4; }
						break;
					case "s":
						if ( w._btwn( now.get(5) + amount, -1, 60 ) ) { ok = 5; }
						break;
					case "a":
						w._offset( "h", ( ( amount > 0 ) ? 1 : -1 ) * 12, false );
						break;
				}
			}
			if ( ok !== false ) { w.theDate.adj( ok, amount ); }
			if ( update === true ) { w.refresh(); }
			if ( o.useImmediate ) { w._t( { method: "doset" } ); }

			if ( w.calBackDate !== false ) {
				w._t( {
					method: "displayChange",
					selectedDate: w.calBackDate,
					shownDate: w.theDate,
					thisChange: mode,
					thisChangeAmount: amount,
				});
			}
				
			w._t( {
				method: "offset",
				type: mode,
				amount: amount,
				newDate: w.theDate
			} );
		},
		_startOffset: function(date) {
			var o = this.options;

			if ( o.startOffsetYears !== false ) {
				date.adj( 0, o.startOffsetYears );
			}
			if ( o.startOffsetMonths !== false ) {
				date.adj( 1, o.startOffsetMonths );
			}
			if ( o.startOffsetDays !== false ) {
				date.adj( 2, o.startOffsetDays );
			}
			return date;
		},
		applyMinMax: function( refresh, override ) {
			// PUBLIC function to apply min/max attributes
			var todayClean, fromEl, fromElDate, daysRaw,
				w = this,
				o = this.options,
				today = new this._date(),
				lod = 24 * 60 * 60 * 1000;

			todayClean = w._pa([0,0,0], today);
			
			if ( typeof refresh === "undefined" ) { refresh = true; }
			if ( typeof override === "undefined" ) { override = true; }

			if ( ( override === true || o.minDays === false ) && 
					( typeof w.d.input.attr( "min" ) !== "undefined" ) ) {

				fromEl =  w.d.input.attr( "min" ).split( "-" );
				fromElDate = new w._date(fromEl[0], fromEl[1]-1, fromEl[2], 0, 0, 0, 0 );
				daysRaw = ( fromElDate.getTime() - todayClean.getTime() ) / lod;
				o.minDays = parseInt( daysRaw * -1 , 10 );
			}
			if ( ( override === true || o.maxDays === false ) && 
					( typeof w.d.input.attr( "max" ) !== "undefined" ) ) {

				fromEl = w.d.input.attr( "max" ).split( "-" );
				fromElDate = new w._date(fromEl[0], fromEl[1]-1, fromEl[2], 0, 0, 0, 0 );
				daysRaw = ( fromElDate.getTime() - todayClean.getTime() ) / lod;
				o.maxDays = parseInt( daysRaw, 10 );
			}

			if ( refresh === true ) { 
				w._t( { method: "refresh" } );
			}
		},
		_build: {
			"default": function () {
				this.d.headerText = "Error";
				if ( this.d.intHTML !== false ) {
					this.d.intHTML.remove().empty();
				}
				this.d.intHTML = $("<div class='ui-body-b'><h2 style='text-align:center'" + 
					" class='bg-danger'>Unknown Mode</h2></div>" );
			}
		},
		_drag: {
			"default": function () { return false; }
		},
		refresh: function() {
			// Provide a PUBLIC function to Refresh the element
			var w = this,
				o = this.options;
			
			if ( typeof w._build[ o.mode ] === "undefined" ) {
				w._build[ "default" ].apply( w, [] );
			} else {
				w._build[ o.mode ].apply( w, [] );
			}
			if ( w.__( "useArabicIndic" ) === true ) { 
				w._doIndic(); 
			}
			w.d.mainWrap.append( w.d.intHTML );
			w._t( {method: "postrefresh"});
		},
		_check: function() {
			// Check to see if a date is valid.
			var td, year, month, date, i, tihm,
				w = this,
				o = this.options,
				now = this.theDate;
			
			w.dateOK = true;
			if ( typeof o.mode === "undefined") { return true; }

			if ( o.afterToday ) {
				td = new w._date();
				if ( now < td ) { now = td; }
			}
			if ( o.beforeToday ) {
				td = new w._date();
				if ( now > td ) { now = td; }
			}
			if ( o.maxDays !== false ) {
				td = new w._date();
				td.adj( 2, o.maxDays );
				if ( now > td ) { now = td; }
			}
			if ( o.minDays !== false ) {
				td = new w._date();
				td.adj( 2, -1 * o.minDays );
				if ( now < td ) { now = td; }
			}
			if ( o.minHour !== false ) {
				if ( now.get(3) < o.minHour ) {
					now.setD( 3, o.minHour );
				}
			}
			if ( o.maxHour !== false ) {
				if ( now.get(3) > o.maxHour ) {
					now.setD( 3, o.maxHour );
				}
			}
			if ( o.minTime !== false ) {
				td = new w._date();
				tihm = o.minTime.split(":"); 
				td.setD( 3, tihm[0] ).setD( 4, tihm[1] );
				if ( now < td ) { now = td; }
			}
			if ( o.maxTime !== false ) {
				td = new w._date();
				tihm = o.maxTime.split(":"); 
				td.setD( 3, tihm[0] ).setD( 4, tihm[1] );
				if ( now > td ) { now = td; }
			}
			if ( o.maxYear !== false ) {
				td = new w._date( o.maxYear, 11, 31 );
				if ( now > td ) { now = td; }
			}
			if ( o.minYear !== false ) {
				td = new w._date( o.minYear, 0, 1 );
				if ( now < td ) { now = td; }
			}

			if ( o.mode.substr(0,4) === "time" || o.mode.substr(0,3) === "dur" ) {
				if ( o.mode === "timeflipbox" && o.validHours !== false ) {
					if ( $.inArray( now.get(3), o.validHours ) < 0 ) { w.dateOK = false; }
				}
			} else {
				if ( o.blackDatesRec !== false ) {
					year = now.get(0);
					month = now.get(1);
					date = now.get(2);

					for ( i=0; i<o.blackDatesRec.length; i++ ) {
						if (
							( o.blackDatesRec[i][0] === -1 || o.blackDatesRec[i][0] === year ) &&
							( o.blackDatesRec[i][1] === -1 || o.blackDatesRec[i][1] === month ) &&
							( o.blackDatesRec[i][2] === -1 || o.blackDatesRec[i][2] === date )
						) { w.dateOK = false; }
					}
				}
				if ( o.blackDates !== false ) {
					if ( $.inArray( now.iso(), o.blackDates ) > -1 ) { 
						w.dateOK = false; 
					}
				}
				if ( o.blackDays !== false ) {
					if ( $.inArray( now.getDay(), o.blackDays ) > -1 ) { 
						w.dateOK = false; 
					}
				}
				if ( o.whiteDates !== false ) {
					if ( $.inArray( w.theDate.iso(), o.whiteDates ) > -1 ) { 
						w.dateOK = true;
						now = w.theDate;
					}
				}
			}
			w.theDate = now;
		},
		_grabLabel: function() {
			// Get the most reasonable label for this datebox.
			// In order of preference - placeholder, title, label for=
			var inputPlaceholder, inputTitle,
				w = this,
				o = this.options,
				tmp = false;

			if ( typeof o.overrideDialogLabel === "undefined" ) {
				inputPlaceholder = w.d.input.attr( "placeholder" );
				inputTitle = w.d.input.attr( "title" );
				
				if ( typeof inputPlaceholder !== "undefined" ) {
					return inputPlaceholder;
				}
				if ( typeof inputTitle !== "undefined" ) {
					return inputTitle;
				}
				tmp = $(document).find( "label[for='" + w.d.input.attr( "id" ) + "']" ).text();
				return ( tmp === "" ) ? false : tmp;
			}
			return o.overrideDialogLabel;
		},
		_makeEl: function( source, parts ) {
			// Populate a source element with data parts.
			var part = false,
				retty = false;

			retty = source.clone();

			if ( typeof parts.attr !== "undefined" ) {
				for ( part in parts.attr ) {
					if ( parts.attr.hasOwnProperty(part) ) {
						retty.data(part, parts.attr[part]);
					}
				}
			}
			return retty;
		},
		_getLongOptions: function( element ) {
			// Pull "long" options from the element, i.e.
			// data-datebox-mode="datebox" --> options.mode
			var key, temp,
				returnObj = {},
				prefix = "datebox",
				prefixLength = 7;

			for ( key in element.data() ) {
				if ( key.substr( 0, prefixLength ) === prefix && key.length > prefixLength ) {
					temp = key.substr( prefixLength );
					temp = temp.charAt( 0 ).toLowerCase() + temp.slice( 1 );
					if ( temp !== "options" ) {
						returnObj[ temp ] = element.data( key );
					}
				}
			}
			return returnObj;
		},
		_setOption: function() {
			$.Widget.prototype._setOption.apply( this, arguments );
			this.refresh();
		},
		getTheDate: function() {
			// Provide a PUBLIC function to get the current date.
			if ( this.calBackDate !== false ) { return this.calBackDate; }
			return this.theDate;
		},
		getLastDur: function() {
			// Provide a PUBLIC function to get the last entered duration
			return this.lastDuration;
		},
		dateVisible: function() {
			// Provide a PUBLIC function to see if selected calendar date is visible
			return this.calDateVisible;
		},
		setTheDate: function( newDate ) {
			// Provide a PUBLIC function to set the date
			// ACCEPTS: Date Object or String in proper output format
			if ( typeof( newDate ) === "object" ) {
				this.theDate = newDate;
			} else {
				this.theDate = this._makeDate( newDate );
			}
			this.refresh();
			this._t( { method: "doset" });
		},
		parseDate: function( format, strdate ) {
			// Provide a PUBLIC function to parse a date
			var retty,
				w = this;
				
			w.fmtOver = format;
			retty = w._makeDate( strdate );
			w.fmtOver = false;
			return retty;
		},
		callFormat: function( format, date, allowArIn ) {
			if ( typeof(allowArIn) === "undefined" ) { allowArIn = false; }
			// Provide a PUBLIC function to get a formatted date
			return this._formatter( format, date, allowArIn );
		},
		getOption: function( opt ) {
			// Provide a PUBLIC function to get a defined option or i18n member
			var i18nTester = this.__(opt);
			if ( typeof i18nTester !== "undefined" ) {
				return i18nTester;
			} else {
				return this.options[ opt ];
			}
		},
		_t: function ( obj ) {
			this.d.input.trigger( "datebox", obj );
		},
		_spf: function ( text, repl ) {
			if ( ! $.isArray(repl) && ! $.isPlainObject(repl) ) { return text; }

			return text.replace(/{(.+?)}/g, function( match, oper ) {
				return repl[oper];
			});
		}
	});


})( jQuery );
