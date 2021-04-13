# Gulag Bot

This Discord bot is designed for tracking gulag wins/loss in the Call of Duty Warzone video game.

## Running the Bot
Run the program with this command:   

    node bot.js > log.txt &  

## Commands
    gu!ratio - returns the specified user's win ratio in the gulag  
    gu!reset - resets the specified user's win/loss ratio to 0 wins and 0 losses  
    gu!stats - returns the specified user's wins and losses  
    gu!tally - add wins and losses to the tracker for the specified user  
    gu!win - add a win to the specified user  
    gu!loss - add a loss to the specified user  

## Usage

    gu!ratio <User>     (This is basically a GET)  
    gu!reset <User>    (This is basically a GET)  
    gu!stats <User>    (This is basically a GET)  
    gu!tally <User> <wins to add> <losses to add>     (This is basically a PUT)  
    gu!win <User>  
    gu!loss <User>  

## Examples

    Input: gu!ratio @User1  
    Output: Win percentage for @User1 is 64%

    Input: gu!reset @User2 
    Output: @User2's wins and losses have been eliminated.

    Input: gu!stats @User3 
    Output: @User3 has 5 wins and 4 losses.

    Input: gu!tally @User4  3 2
    Output: Updating @User4's wins to 3 and losses to 2.

    Input: gu!win @User4 
    Output: Updating @User4 wins to 1

    Input: gu!loss @User4 
    Output: Updating @User4's losses to 3