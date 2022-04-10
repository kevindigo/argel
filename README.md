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

### General design

`Game` only runs on the server. Each client can use the model objects and their helpers. 
Only `Game` can update the official game `State`. 

The `State` object that the client receives will always have a list of legal `Deed`s, 
or other choices that need to be made as a result of effects. The client will let the 
server know which `Deed` or other option should be executed. 

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
    * `Side` = A player, and their DrawPile, Discards, Hand, Scored, Line, Arsenal, and Flags
        * Flag: `isNextCardActive` = The next played card will be Active instead of Dormant
        * Flag: `canPlayActions` = Can play Actions this turn
        * Flag: `canFight`= Can Fight this turn
    * `State` = A data object containing the complete game state
    * `TurnState` = Who is the Active Player, and TurnFlags
        * `QueuedAdditionalPlay` = After this Deed, Active Player can Play another Card
        * `QueuedFightLineIndex` = After this Deed, Active Player can Fight with this Creature
        * `TurnFlags`
            * `canDiscard` = The Active Player either has played a card this turn, 
                or cannot play and has revealed their hand, so they are allowed to Discard
* Locations
    * `Discards` (D) = A face-up discard pile
    * `DrawPile` = Face-down cards available to draw
        * `Bottom` (B) = Bottom card in a DrawPile
        * `Top` (T) = Top card in a DrawPile
    * `Hand`(H)
    * `Line` (L) = A player's in-play Creatures
    * `Purgatory` (P) = A temporary holding place during a Deed
    * `Arsenal` (A) = A player's in-play Relics
    * `Scored` (S) = A players's score pile
* Deeds
    * `Discard` = Move a Card from Hand to Discards
    * `Fight` = Initiate a battle
    * `Harvest` = Score a Mature card
    * `Play` = Play a card from hand
* Effects
    * `ChooseNumber` (N) = Choose a number / chosen number
    * `Draw` = Move a Card from a DrawPile to that Side's Hand
    * `EndTurn` (END) = Immediately end turn, without drawing or rotating
    * `Harvest` = Move a Mature card to Discards
    * `Play` = Move a Card from Hand to Line (position -1 means the right end)
    * `Queue` (Q) = Queue a Play or Fight for after this Deed
    * `Reveal` (%) = Make a current hand visible to the other Player
    * `Rotate` (@) = Change the orientation/state of an in-play Card
* Qualifiers
    * `Any` (A) = Any (location), used to mean either of My (M) and Opp (O)
    * `Controller` (C) = Whose line or arsenal the card is in
    * `Highest` (^) = Of the candidates, the ones with the highest Power (^P) or VP (^V)
    * `Lowest` (v) = Of the candidates, the ones with the lowest Power (vP) or VP (vV)
    * `My` (M) = Belonging to the active player
    * `Enemy` (E) = Belonging to the non-active player
    * `Owner` (O) = The Player using the DeckId that matches the Card being owned
        * Note: this prevents mirror matches where both players use the same deck!
* Values
    * `Count` (#) = The number of selected cards
    * `Power` (P) = The effective power of an in-play Card
    * `VictoryPoints` (V) = The VP of a Cardef or sum of a Scored
* Triggers
    * `Harvest` (H:) = Bonus that triggers on a Harvest
    * `Optional` (MAY:) = Optional Effect
    * `WinFight` (WF:) = Bonus that triggers when the Creature wins a fight
* Other
    * (=) = The card that is triggering the Effect
    * `CardState` = State of an in-play Creature or Relic
        * `Dormant` (@D) = An in-play card is turned left (can't be used)
        * `Active` (@A) = An in-play card is upright (can Fight)
        * `Mature` (@M) = An in-play card is turned right (can Fight or Harvest)
    * `If/Else` (if ? :) = if(cond) ? <doiftrue> : <dootherwise>
    * `Random` = If the hand is not revealed, random is automatic
    * `Repeat` (x) = "5x(MT > H)" would mean draw from top to hand 5 times
    * `ShuffleLocation` (&) = Shuffle the cards in the specified location
    * `ShuffleInto` (~) = Shuffle a card into its owner's DrawPile

When identifying the "from", most locations must be prefixed with `M` or `O` to indicate the Side. 

When identifying the "to", a Side does not have to be specified for DrawPile, Discards, or Hand, 
because Cards will always go to their Owner's respective location. 
