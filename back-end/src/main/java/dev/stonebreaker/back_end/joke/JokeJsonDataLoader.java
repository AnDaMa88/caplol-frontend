package dev.stonebreaker.back_end.joke;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.io.InputStream;

@Component
public class JokeJsonDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(JokeJsonDataLoader.class);
    private final ObjectMapper objectMapper;
    private final JokeRepository jokeRepository;

    public JokeJsonDataLoader(ObjectMapper objectMapper, JokeRepository jokeRepository) {
        this.objectMapper = objectMapper;
        this.jokeRepository = jokeRepository;
    }


    @Override
    public void run(String... args) throws Exception {

        if(jokeRepository.count() == 0) {

            try (InputStream inputStream = TypeReference.class.getResourceAsStream("/data/jokes.json")) {
                Jokes firstJokes = objectMapper.readValue(inputStream, Jokes.class);
                System.out.println(firstJokes.toString());
                log.info("Reading {} jokes from JSON data and saving to in-memory collection.", firstJokes.jokes().size());

                //handle null values for text jokes/img jokes
//                for (Joke joke : firstJokes.jokes()) {
//                    if (joke.joke_type() == JokeType.TEXT && joke.image_path() == null) {
//                        // Ensure image_path is null for text jokes
//                        jokeRepository.create(new Joke(joke.id(), joke.joke_text(), joke.joke_type(), null, joke.approved()));
//                    } else if (joke.joke_type() == JokeType.IMAGE && joke.joke_text() == null) {
//                        // Ensure joke_text is null for image jokes
//                        jokeRepository.create(new Joke(joke.id(), null, joke.joke_type(), joke.image_path(), joke.approved()));
//                    } else {
//                        // Process as a standard joke
//                        jokeRepository.create(joke);
//                    }
//                }
                jokeRepository.saveAll(firstJokes.jokes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to read JSON data", e);
            }
        } else {
            log.info("Not loading Jokes from JSON data because the collection contains data.");
        }
    }
}
