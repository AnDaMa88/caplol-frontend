package dev.stonebreaker.back_end.joke;


public record Joke(
        Integer id,
        String joke_text,
        JokeType joke_type,
        String joke_credit,
        String image_path,
        Integer approved
        ) { }
