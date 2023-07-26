<?php

return [
    'route' => [
        'prefix' => env('LEAGUEFY_ROUTE_PREFIX', 'api/leaguefy/v1'),
        'middleware' => [],
    ],

    'database' => [
        'connection' => '',

        'tables' => [
            'games' => 'leaguefy_games',
            'teams' => 'leaguefy_teams',
            'tournaments' => 'leaguefy_tournaments',
            'tournaments_teams' => 'leaguefy_tournaments_teams',
            'configs' => 'leaguefy_tournament_configs',
            'stages' => 'leaguefy_stages',
            'stage_parents' => 'leaguefy_stage_parents',
            'matches' => 'leaguefy_matches',
        ],
    ],
];
