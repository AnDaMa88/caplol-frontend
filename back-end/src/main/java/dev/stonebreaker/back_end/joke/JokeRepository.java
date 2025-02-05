package dev.stonebreaker.back_end.joke;


import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JokeRepository {
    private final JdbcClient jdbcClient;

    public JokeRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<Joke> findJokes(String type, int page, int amount) {
        int offset = (page - 1) * amount;

        return jdbcClient.sql("SELECT * FROM jokes WHERE joke_type = ? ORDER BY id DESC LIMIT ? OFFSET ?")
                .params(List.of(type, amount, offset))
                .query(Joke.class)
                .list();
    }

    public int countJokesByType(String type) {
        return jdbcClient.sql("SELECT COUNT(*) FROM jokes WHERE joke_type = ?")
                .params(List.of(type))
                .query(Integer.class)
                .single();
    }

    public List<Joke> findTextJokes(int offset, int amount) {
        String query = "SELECT * FROM jokes WHERE joke_type = 'TEXT' ORDER BY id DESC LIMIT " + amount + " OFFSET " + offset;

        return jdbcClient.sql(query)
                .query(Joke.class)
                .list();
    }

    public int countTextJokes() {
        return jdbcClient.sql("SELECT COUNT(*) FROM jokes WHERE joke_type = 'TEXT'")
                .query(Integer.class)
                .single();
    }

    public List<Joke> findImageJokes(int startId, int endId) {

        return jdbcClient.sql("SELECT * FROM jokes WHERE joke_type = 'IMAGE' AND id BETWEEN ? AND ? ORDER BY id ASC")
                .params(List.of(startId, endId))
                .query(Joke.class)
                .list();
    }

    public int countImageJokes() {
        return jdbcClient.sql("SELECT COUNT(*) FROM jokes WHERE joke_type = 'IMAGE'")
                .query(Integer.class)
                .single();
    }

    public List<Joke> findSongImage() {

        return jdbcClient.sql("SELECT * FROM jokes WHERE id = ?")
                .params(1)
                .query(Joke.class)
                .list();
    }

    public List<Joke> findSongAudio() {
        return jdbcClient.sql("SELECT * FROM jokes WHERE id = ?")
                .params(2)
                .query(Joke.class)
                .list();
    }



//    // Fetch the latest 9 text jokes for a given page, sorted by date (newest first)
//    @Query("SELECT j FROM Joke j WHERE j.type = 'TEXT' ORDER BY j.createdAt DESC")
//    List<Joke> findLatestTextJokes(org.springframework.data.domain.Pageable pageable);
//
//    // Fetch the first 15 image jokes in a given ID range (for weekly rotation)
//    @Query("SELECT j FROM Joke j WHERE j.type = 'IMAGE' AND j.id BETWEEN :startId AND :endId ORDER BY j.id ASC")
//    List<Joke> findImageJokesForWeek(int startId, int endId);
//
//    // Count total text jokes to calculate pagination
//    @Query("SELECT COUNT(j) FROM Joke j WHERE j.type = 'TEXT'")
//    int countTextJokes();
//
//    // Fetch the song data (only one record, the latest one)
//    @Query("SELECT s FROM Song s ORDER BY s.uploadDate DESC LIMIT 1")
//    Song findLatestSong();



    public void create (Joke joke) {
        var updated = jdbcClient.sql("INSERT INTO jokes(id, joke_text, joke_type, joke_credit, image_path, approved) values(?,?,?,?,?,?)")
                .params(List.of(joke.id(), joke.joke_text(), joke.joke_type().toString(), joke.joke_credit(), joke.image_path(), joke.approved()))
                .update();

        Assert.state(updated == 1, "Failed to create joke " + joke.id());
    }

//    public Optional<Joke> findByType(JokeType jokeType) {
//        return jdbcClient.sql("")
//    }




    public int count() {
        return jdbcClient.sql("select * from jokes").query().listOfRows().size();
    }

    //probably dont need this for jsonloader anymore mayyybe
    public void saveAll(List<Joke> jokes) {
        jokes.stream().forEach(this::create);
    }
}
