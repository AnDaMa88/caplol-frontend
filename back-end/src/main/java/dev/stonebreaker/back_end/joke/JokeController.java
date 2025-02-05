package dev.stonebreaker.back_end.joke;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jokes")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class JokeController {
    private final JokeRepository jokeRepository;

    public JokeController(JokeRepository jokeRepository) {
        this.jokeRepository = jokeRepository;
    }

    @GetMapping
    public Map<String, Object> getJokes(
            @RequestParam(defaultValue = "TEXT") String type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int amount) {

        List<Joke> jokes = jokeRepository.findJokes(type, page, amount);
        int totalJokes = jokeRepository.countJokesByType(type);
        int totalPages = (int) Math.ceil((double) totalJokes / amount);

        return Map.of(
                "jokes", jokes,
                "currentPage", page,
                "totalPages", totalPages
        );
    }

    @GetMapping("/text")
    public Map<String, Object> getTextJokes(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int amount) {

        int totalJokes = jokeRepository.countTextJokes();
        int remainingJokes = totalJokes - 27;
        int totalPages = 3 + (int) Math.ceil((double) remainingJokes / 15);

        int offset;
        if (page <= 3) {
            amount = 9;
            offset = (page - 1) * amount;
        } else {
            amount = 15;
            offset = 27 + ((page - 4) * amount);
        }


        List<Joke> textJokes = jokeRepository.findTextJokes(offset, amount);


        return Map.of(
                "jokes", textJokes,
                "totalPages", totalPages
        );
    }

    @GetMapping("/song")
    public Map<String, Object> getSongData() {
        // Retrieve the song image and song audio records from the repository
        List<Joke> songImage = jokeRepository.findSongImage();
        List<Joke> songAudio = jokeRepository.findSongAudio();

        // Return both in a map
        return Map.of(
                "songImage", songImage,
                "songAudio", songAudio
        );
    }

    //get image jokes based on page and weekly rotation
    @GetMapping("/image")
    public Map<String, Object> getImageJokes(
            @RequestParam(defaultValue = "1") int page) {
        //if week is 0 use 3-17 -- 1 use 18-32 -- 2 use 33- 47
        //week 0 ex.  if page is 1 use 3-7, --2 use 8-12, --3 use 13-17
        //week 1          page 1 use 18-22    2     23-27   3     28-32
        //week 2               1     33-37    2     38-42   3     43-47
        int startId = 0;
        switch (page) {
            case 1:
                startId = 3;
                break;
            case 2:
                startId = 8;
                break;
            case 3:
                startId = 13;
                break;
            default:
                startId = 3;
        }

        int weekNumber = (int) (System.currentTimeMillis() / (1000 * 60 * 60 * 24 * 7)) % 3; // Rotates every 3 weeks
        startId += (weekNumber * 15);
        int endId = startId + 4;


        List<Joke> imageJokes = jokeRepository.findImageJokes(startId, endId);
        int totalJokes = jokeRepository.countImageJokes();
        int totalPages = ((int) Math.ceil((double) totalJokes / 5)) - 1;

        // Return both in a map
        return Map.of(
                "jokes", imageJokes,
                "totalPages", totalPages
        );
    }
}
