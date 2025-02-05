package dev.stonebreaker.back_end.joke;

import java.util.List;
import java.util.Objects;

public record Jokes(List<Joke> jokes) {
    public Jokes {
//        Objects.requireNonNull("jokes list cannot be null!");
    }
}
