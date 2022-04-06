# Argel - Ardent Reapers Game Engine Library

Code Copyright 2022 by Kevin B. Smith (kevindigo)

Based on Ardent Reapers by Gee Barger and Luke Olson

## Creature play effects
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

## Action play effects
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

## Creature bonus effects
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

## Relic bonus effects
    * Automatic
        * draw 3
        * during opponent's next turn, they cannot play cards

    * Single target
        * choose from opp relics; move to discards
        * choose from opp relics; move it to your scored; move this to opp scored
        * choose from enemy line (mature); move to discards

    * Special
        * discard 2 from hand; if you do, move this to your scored; otherwise move to opponent's scored

## Ongoing effects
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

## Skills
    * Sneak X
    * BearHug
    * Teamup
