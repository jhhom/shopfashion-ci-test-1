Feature: Product search
    Scenario: search produce search term suggestions with available product names
        Given the database has following products
            | T-shirt          |
            | Jeans            |
            | Stylish dress    |
            | Red dotted shirt |
            | Shorts           |
        When user types in the search term "shi"
        Then the search should suggest
            | T-shirt          |
            | Red dotted shirt |
