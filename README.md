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
    * `Side` = A player, and their DrawPile, Discards, Hand, Scored, Line, and Relics
    * `TurnState` = Who is the Active Player, and TurnFlags
        * `QueuedAdditionalPlay` = After this Action, Active Player can Play another Card
        * `QueuedAttackLineIndex` = After this Action, Active Player can Attack with this Creature
        * `TurnFlags`
            * `NEXT_CARD_READY` = The next played card will be Ready instead of Dormant
            * `HAS_PLAYED_CARD` = The Active Player is allowed to Discard
* Locations
    * `Discards` (D) = A face-up discard pile
    * `DrawPile` = Face-down cards available to draw
        * `Bottom` (B) = Bottom card in a DrawPile
        * `Top` (T) = Top card in a DrawPile
    * `Hand`(H)
    * `Line` (L) = A player's in-play Creatures
    * `Relics` (R) = A player's in-play Relics
    * `Scored` (S) = A players's score pile
* Actions
    * `Attack` = Initiate a fight
    * `Discard` = Move a Card from Hand to Discards
    * `Harvest` = Move a Mature card to Discards
    * `Play` = Move a Card from Hand to Line
    * `Shuffle` = Shuffle a DrawPile
* Other
    * `CardState` = State of an in-play Creature or Relic
        * `Active` = Ready or Mature (can fight or Harvest)
        * `Dormant` = An in-play card is turned left (can't Attack or Harvest)
        * `Mature` = An in-play card is turned right (can Harvest)
        * `Ready` = An in-play card is upright (can Attack)
    * `Fight` = The result of an Attack, where 2 opposing Creatures fight
    * `My` (M) = Belonging to the active player
    * `Opponent`/`Opp` (O) = The non-active player
    * `Owner` = The Player using the DeckId that matches the Card being owned
        * Note: this prevents mirror matches where both players use the same deck!

When identifying the "from", locations must be prefixed with `M` or `O` to indicate the Side. 

When identifying the "to", a Side does not have to be specified for DrawPile or Discards, 
because Cards will always go to their Owner's respective location. 


### Creature play effects
    * Automatic
        * draw
        * queue a play (bottom)
        * move top card of your deck to your opp scored
        * move all creatures worth <= 1 VP to their controller's scored

    * Single target
        * choose from either line (VP <= 0) to hand
        * choose from enemy line (power <= 5) to hand
        * choose from enemy line (lowest VP); move to your scored
        * choose from enemy line; rotate to dormant

    * Optional
        * optional: choose from opp scored; move to hand

    * Special
        * draw 2; choose 1 from hand; move it to discards
        * reveal opponent hand; choose from opp hand (lowest power creature); move it to opp scored

### Action play effects
    * Automatic
        * (no effect)
        * draw 2
        * move random from opponent hand to discards
        * shuffle your discards and place on top of your deck
        * rotate all cards to mature
        * rotate all cards to dormant
        * rotate all friendly cards to dormant
        * next card you play enters active
        * until start of your next turn, enemy creatures cannot attack
        * during opponent's next turn, they cannot play actions
        * move all creatures to discard
        * move all creatures >=1 VP to their owner's scored
        * move top card of opp deck to discard (if it is <0 VP, move it to opp scored instead)

    * Single card target    
        * choose from hand; move it to your scored
        * choose from hand; move it to opp scored
        * choose from either line; move it to the bottom of deck
        * choose from enemy line; move it to hand
        * choose an enemy relic; move it to deck (shuffle)
        * choose an enemy relic; move it to your scored
        * choose from your scored; move it to opp scored
        * choose from opp scored; move it to your scored
        * choose from opp scored; move to hand

    * Conditional single target
        * choose from either line (power >= 7); move it to discards
        * choose from enemy line (VP >= 1), move it to your scored
        * choose from your discards (creature); move it to hand
        * choose from your line (dormant); rotate it to active and queue an attack

    * Single target conditional effect
        * choose from either line; rotate it (friendly->mature, enemy->dormant)
        * choose from either line; rotate it (friendly->dormant, enemy->mature)

    * Multiple cards
        * choose up to 3 creatures; move them to hands
        * choose 1 from each line; move each to its owner's scored
        * choose 2 from each line; move them to decks (shuffle)


    * Conditional multiple cards
        * choose 1 from each scored (most valuable); move them to discards

    * Special
        * if opponent scored > your scored, choose from opponent scored (lowest VP); move it to your scored
        * choose 2 from hand; discard them; if you do, draw 5
        * choose a number; reveal opponent's hand; move any cards with VP = chosen number to discards

    * Multiple decisions
        * choose from enemy line; choose destination in your line; move it
        * choose from your line; choose destination in your opponent's line; move it
        * choose 2 from each scored; choose 2 of those; move them to opp scored; move others to your scored

### Creature bonus effects
    * Automatic
        * harvest: queue a play (top)
        * draw 1
        * move all creatures (power <= 3) to discards
        * move all relics to discards
        * harvest: opponent discards 2 cards [RANDOM???]
        * wins fight: draw 3; end turn (before rotate and draw)

    * Optional
        * optional: choose from your scored; move to hand

    * Single target
        * choose from enemy line; rotate to mature
        * choose from your scored (highest VP); move to opp scored
        * choose from opp scored; move to discards
        * choose from your discards; move to hand
        * choose a card; rotate to a different state
        * choose a friendly card; rotate to active
        * harvest: choose from opp scored; move to discards
        * harvest: choose from your scored; move to top of deck
        * harvest: choose from your hand; move to opp scored

    * Special
        * reveal your hand; choose from hand (lowest power); move to your scored

### Relic bonus effects
    * Automatic
        * draw 3
        * during opponent's next turn, they cannot play cards

    * Single target
        * choose from opp relics; move to discards
        * choose from opp relics; move it to your scored; move this to opp scored
        * choose from enemy line (mature); move to discards

    * Special
        * discard 2 from hand; if you do, move this to your scored; otherwise move to opponent's scored

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
