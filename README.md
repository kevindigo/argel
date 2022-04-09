# Argel - Ardent Reapers Game Engine Library

Code Copyright 2022 by Kevin B. Smith (kevindigo)

Based on Ardent Reapers by Gee Barger and Luke Olson

Ardent Reapers is copyright 2022 Gee Barger, Luke Olson, and ProGen Distillery Games and is used with permission. 

More information about Ardent Reapers can be found at https://ardentreapers.com

## What is this?

Argel is a library (written in typescript) that implements the 
components and rules of the Ardent Reapers card game. 

The goal 
is to develop the low-level code that could be used to create 
a full online implementation (with rules enforcement). That 
could be a standalone site along the lines of TheCrucible.online, 
or perhaps it could be used in BoardGameArena or one of the 
other online gaming sites. Or even in an app. 

## How do I use it?

It's not really usable yet. But in the future, you will be 
able to build an application around it! Wrap a UI around it, 
so we can all play AR online, with rules 
enforcement. The UI could be text-based or graphical, and 
could be real-time or asynchronous. It could be self-contained 
or split between client and server. 

In your typescript or javascript appliction, add this library. 
Docs for the specific calls aren't available yet. Stay tuned. 

## Developer reference

`npm ci` will install the dependencies
`npm test` will run the unit tests
`npm run lint` will check for problems
`npm run build` will build the library
`npm start` will run whatever demo code is there

## Design notes

### Terminology
* Items
    * `Card` = An instance of a card (based on a cardef)
    * `Cardef` = The definition of a card (SetId, CardNumber)
    * `CardId` = The set and number of a card
    * `CardNumber` = 3-digit identifier within a set
    * `CardWithState` = An in-play Creature or Relic
    * `DeckId` = UID of a deck
    * `DeckList` = A SetId, DeckId, and list of CardNumbers
    * `Game` = A session in progress; Consists of 2 Sides and a TurnState
    * `Player` = Identified by their name and DeckId
    * `SetId` = Name of a set (e.g. "Omega Codex")
    * `Side` = A player, and their DrawPile, Discards, Hand, Scored, Line, Relics, and Flags
        * Flag: `isNextCardActive` = The next played card will be Active instead of Dormant
        * Flag: `canPlayActions` = Can play Actions this turn
        * Flag: `canAttack`= Can Attack this turn
    * `TurnState` = Who is the Active Player, and TurnFlags
        * `QueuedAdditionalPlay` = After this Action, Active Player can Play another Card
        * `QueuedAttackLineIndex` = After this Action, Active Player can Attack with this Creature
        * `TurnFlags`
            * `CAN_DISCARD` = The Active Player either has played a card this turn, 
                or cannot play and has revealed their hand, so they are allowed to Discard
* Locations
    * `Discards` (D) = A face-up discard pile
    * `DrawPile` = Face-down cards available to draw
        * `Bottom` (B) = Bottom card in a DrawPile
        * `Top` (T) = Top card in a DrawPile
    * `Hand`(H)
    * `Line` (L) = A player's in-play Creatures
    * `Purgatory` (P) = A temporary holding place during an action
    * `Relics` (R) = A player's in-play Relics
    * `Scored` (S) = A players's score pile
* Actions
    * `Attack` = Initiate a fight
    * `ChooseNumber` (N) = Choose a number / chosen number
    * `Discard` = Move a Card from Hand to Discards
    * `Draw` = Move a Card from a DrawPile to that Side's Hand
    * `EndTurn` (.) = Immediately end turn, without drawing or rotating
    * `Harvest` = Move a Mature card to Discards
    * `Play` = Move a Card from Hand to Line
    * `Queue` (Q) = Queue a Play or Attack for after this Action
    * `Reveal` (%) = Make a current hand visible to the other Player
    * `Rotate` (@) = Change the orientation/state of an in-play Card
* Other
    * (=) = The card that is triggering the action
    * `All` (*) = Every Card at a location
    * `Any` (A) = Any (location), used to mean either of My (M) and Opp (O)
    * `CardState` = State of an in-play Creature or Relic
        * `Dormant` (@D) = An in-play card is turned left (can't Attack or Harvest)
        * `Mature` (@M) = An in-play card is turned right (can Harvest)
        * `Active` (@A) = An in-play card is upright (can Attack)
    * `Fight` = The result of an Attack, where 2 opposing Creatures fight
    * `Highest` (^) = Of the candidates, the ones with the highest Power (^P) or VP (^V)
    * `If/Else` (if ? :) = if(cond) ? <doiftrue> : <dootherwise>
    * `InPlay` = In a Line or Relics row
    * `Lowest` (v) = Of the candidates, the ones with the lowest Power (vP) or VP (vV)
    * `My` (M) = Belonging to the active player
    * `Opponent`/`Opp` (O) = The non-active player
    * `Optional` (O:) = Optional action
    * `Or` (|) = Can choose one of multiple options
    * `Owner` = The Player using the DeckId that matches the Card being owned
        * Note: this prevents mirror matches where both players use the same deck!
    * `Power` (P) = The effective power of an in-play Card
    * `Random` (r) = Selected at random from the location
    * `Repeat` (x) = "5x(MT > H)" would mean draw from top to hand 5 times
    * `ShuffleLocation` (&) = Shuffle the cards in the specified location
    * `ShuffleInto` (~) = Shuffle a card into its owner's DrawPile
    * `VictoryPoints` (V) = The VP of a Cardef or sum of a Scored

When identifying the "from", most locations must be prefixed with `M` or `O` to indicate the Side. 

When identifying the "to", a Side does not have to be specified for DrawPile, Discards, or Hand, 
because Cards will always go to their Owner's respective location. 


### Creature play effects
    * Automatic
        * draw (`MT > H`)
        * queue a play (bottom) (`Q:MB>MLx`)
        * move top card of your deck to your opp scored (`MT > OS`)
        * move all creatures worth <= 1 VP to their controller's scored (`ML*(V<=1) > MS, OL*(V<=1) > OS`)

    * Single target
        * choose from enemy line; rotate to dormant (`OLx @D`)

    * Conditional target
        * choose from either line (VP <= 0) to hand (`|ALx(V<=0) > H`)
        * choose from enemy line (power <= 5) to hand (`OLx(P<=5)) > H`)
        * choose from enemy line (lowest VP); move to your scored (`ELx(vV) > MS`)

    * Optional
        * optional: choose from opp scored; move to hand (`O: OS > H`)

    * Special
        * draw 2; choose 1 from hand; move it to discards (`MT > H, MT > H, MHx > D`)
        * reveal opponent hand; choose from opp hand (lowest power creature); move it to opp scored (`%OH, OH(vP)x > OS`)

### Action play effects
    * Automatic
        * (no effect)
        * draw 2 (`MT > H`, `MT > H`)
        * move random from opponent hand to discards (`OHR > D`)
        * shuffle your discards and place on top of your deck (&MD, MD* > T)
        * rotate all cards to mature (`ML* @M, MR* @M, OL* @M, OR* @M`)
        * rotate all cards to dormant (`ML* @D, MR* @D, OL* @D, OR* @D`)
        * rotate all friendly cards to dormant (`ML* @D, MR* @D`)
        * next card you play enters Active (even if it's your next turn) (F:NCA)
        * until start of your next turn, enemy creatures cannot attack ???????????????
        * during opponent's next turn, they cannot play actions ???????????????
        * move all creatures to discard (`ML* > D, OL* > D`)
        * move all creatures >=1 VP to their owner's scored (`ML*(V>=1) > S, OL*(V>=1) > S`)
        * move top card of opp deck to: <0 VP > discard else to opp scored (`MT > P, if(X(V<0)? X > D : X > OS`)

    * Single card target    
        * choose from hand; move it to your scored (`MHx > MS`)
        * choose from hand; move it to opp scored (`MHx > OS`)
        * choose from either line; move it to the bottom of deck (`yLx > B`)
        * choose from enemy line; move it to hand (`OLx > H`)
        * choose an enemy relic; move it to deck (shuffle) (`ORx > ~`)
        * choose an enemy relic; move it to your scored (`ORx > MS`)
        * choose from your scored; move it to opp scored (`MSx > OS`)
        * choose from opp scored; move it to your scored (`OSx > MS`)
        * choose from opp scored; move to hand (`OSx > H`)

    * Conditional single target
        * choose from either line (power >= 7); move it to discards (`|MLx(P>=7) > D | OLx(P>=7) > D`)
        * choose from enemy line (VP >= 1), move it to your scored (`OLx(V>=1) > MS`)
        * choose from your discards (creature); move it to hand (`MDx(T=C) > H`)
        * choose from your line (dormant); rotate it to active and queue an attack (`MLx(@D) @A, QA`)

    * Single target conditional effect
        * choose from either line; rotate it (friendly->mature, enemy->dormant) (`|MLx @M | OLx @D`)
        * choose from either line; rotate it (friendly->dormant, enemy->mature) (`|MLx @D | OLx @M`)

    * Multiple cards
        * choose up to 3 creatures; move them to hands (`ALx > H, ALx > H, ALx > H`)
        * choose 1 from each line; move each to its owner's scored (`MLx > S, OLx > S`)
        * choose 2 from each line; move them to decks (shuffle) (`MLx > ~, MLx > ~, OLx > ~, OLx > ~`)


    * Conditional multiple cards
        * choose 1 from each scored (most valuable); move them to discards (`MS(^V)x > D`)

    * Special
        * if opponent scored > your scored, 
            choose from opponent scored (lowest VP); move it to your scored (`if(OV>MV):OS(vV)x > MS`)
        * choose 2 from hand; discard them; if you do, draw 5 (`MHx > X, MHx > X, if(#X>1) ? 5x(MT > H), X > D : X > D`)
        * choose a number; reveal opponent's hand; move any cards with VP = chosen number to discards (`N, %OH, OH(V=N)* > D`)

    * Multiple decisions
        * choose from enemy line; choose destination in your line; move it (`OLx > MLy`)
        * choose from your line; choose destination in your opponent's line; move it (`MLx > OLy`)
        * choose 2 from each scored; choose 2 of those; move them to opp scored; move others to your scored (`MSx > X, MSx > X, OSx > X, OSx > X, Xx > OS, Xx > OS, X* > MS)

### Creature bonus effects
    * Automatic
        * harvest: queue a play (top) (`QT`)
        * draw 1 (`MT > H`)
        * move all creatures (power <= 3) to discards (`ML*(P<=3) > D, OL*(P<=3) > D`)
        * move all relics to discards (`MR* > D, OR* > D)
        * harvest: opponent discards 2 cards (`OHr > D, OHr > D`)
        * wins fight: draw 3; end turn (before rotate and draw) (`3x(MT > H), .`)

    * Optional
        * optional: choose from your scored; move to hand (`O: MS > H`)

    * Single target
        * choose from enemy line; rotate to mature (`OL @M`)
        * choose from your scored (highest VP); move to opp scored (`MS(^V)x > OS`)
        * choose from opp scored; move to discards (`OS > D`)
        * choose from your discards; move to hand (`MD > H`)
        * choose a card; rotate to a different state (`|MLx @y | OLx @y`)
        * choose a friendly card; rotate to active (`MLx @A`)
        * harvest: choose from opp scored; move to discards (`OS > D`)
        * harvest: choose from your scored; move to top of deck (`MS > T`)
        * harvest: choose from your hand; move to opp scored (`MHx > OS`)

    * Special
        * reveal your hand; choose from hand (lowest power); move to your scored (`%MH, MH(vP)x > MS`)

### Relic bonus effects
    * Automatic
        * draw 3 (`MT > H, MT > H, MT > H`)
        * during opponent's next turn, they cannot play cards ???????????????

    * Single target
        * choose from opp relics; move to discards (`ORx > D`)
        * choose from opp relics; move it to your scored; move this to opp scored (`ORx > MS, = > OS`)

    * Conditional target
        * choose from enemy line (mature); move to discards (`OLx(@M) > D`)

    * Special
        * discard 2 from hand; if you do, move this to your scored; otherwise move to opponent's scored (`2x(MH > X), if(#X>2) ? X > D, = > MS : X > D`)

### Ongoing effects
    * Global
        * first creature played each turn enters play active
        * your hand size +1
        * opponent hand size -1
        * opponent cannot play actions
        * friendly creatures +1 power
        * friendly creatures gain teamup
        * friendly creatures gain sneak 5

    * This
        * this can only fight dormant creatures
        * when this is active, opponent cannot play actions or relics
        * this cannot be harvested
        * if this loses a fight, opponent discards their hand
        * when this leaves play, draw a card

### Skills
    * Sneak X
    * BearHug
    * Teamup
