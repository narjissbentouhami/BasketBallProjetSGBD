import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const PublicPage = () => {
  const [highestHeightClub, setHighestHeightClub] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const [topThreePointPlayers, setTopThreePointPlayers] = useState([]);
  const [topFreeThrowPlayers, setTopFreeThrowPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [topAssistPlayer, setTopAssistPlayer] = useState(null);
  const [assistDialogOpen, setAssistDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topSponsor, setTopSponsor] = useState(null);
  const [clubsWithMostEuroleagueWins, setClubsWithMostEuroleagueWins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubRes, topPlayersRes, topThreePointRes, freeThrowRes, clubsRes, sponsorRes, euroleagueRes] = await Promise.all([
          axios.get("http://localhost:8080/api/clubs/highest-average-height"),
          axios.get("http://localhost:8080/api/playerStats/top-players"),
          axios.get("http://localhost:8080/api/playerStats/top-three-points-by-club"),
          axios.get("http://localhost:8080/api/playerStats/top-free-throws/4"),
          axios.get("http://localhost:8080/api/clubs/"),
          axios.get("http://localhost:8080/api/sponsors/top-sponsor/5"),
          axios.get("http://localhost:8080/api/clubs/most-euroleague-wins"),
        ]);

        setHighestHeightClub(clubRes.data);
        setTopPlayers(topPlayersRes.data);
        setTopThreePointPlayers(topThreePointRes.data);
        setTopFreeThrowPlayers(freeThrowRes.data);
        setClubs(clubsRes.data);
        setTopSponsor(sponsorRes.data);
        setClubsWithMostEuroleagueWins(euroleagueRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClubClick = async (clubId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/playerStats/top-assist-player/${clubId}`);
      setTopAssistPlayer(response.data);
      setAssistDialogOpen(true);
    } catch (error) {
      console.error("Error fetching top assist player:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box textAlign="center" my={4}>
        <Typography variant="h2" color="primary" gutterBottom>
          Basketball Insights
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Explore top clubs, players, and game stats!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" color="secondary" gutterBottom>
                Club with the Highest Average Height
              </Typography>
              {highestHeightClub ? (
                <Typography variant="body1">
                  <strong>{highestHeightClub.club_name}</strong> - Average Height: {" "}
                  <strong>{highestHeightClub.average_height} cm</strong>
                </Typography>
              ) : (
                <Typography color="error">No club data found.</Typography>
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                Top Players by National Team
              </Typography>
              {topPlayers.length > 0 ? (
                <Box>
                  {topPlayers.map((player, index) => (
                    <Typography key={index} variant="body1" sx={{ marginBottom: "8px" }}>
                      <strong>{player.name}</strong> - National Team: {" "}
                      <strong>{player.nationalTeamName}</strong>, Success Percentage: {" "}
                      <strong>{player.avgSuccessPercentage.toFixed(2)}%</strong>
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography color="error">No players data found.</Typography>
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                Top Players in Free Throws (European Championship 2002 Final)
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Player Name</TableCell>
                      <TableCell>Free Throws Made</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Game Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topFreeThrowPlayers.map((player) => (
                      <TableRow key={player.player_id}>
                        <TableCell>{player.player_name}</TableCell>
                        <TableCell>{player.free_throws_made}</TableCell>
                        <TableCell>{player.free_throw_percentage.toFixed(2)}%</TableCell>
                        <TableCell>{player.game_type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
        <Typography variant="h5" color="primary" gutterBottom>
        Players who have the greatest percentage of 3 points for each club (Season 2023)
              </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Club</strong></TableCell>
                  <TableCell><strong>Player</strong></TableCell>
                  <TableCell><strong>3-Point Percentage</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topThreePointPlayers.length > 0 ? (
                  topThreePointPlayers.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.club_name}</TableCell>
                      <TableCell>{row.player_name}</TableCell>
                      <TableCell>{row.three_point_percentage.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" color="primary" gutterBottom>
          Top Assist Player by Clubs (Click on a club to view the top assist player)
          </Typography>
          <Grid container spacing={2}>
            {clubs.map((club) => (
              <Grid item xs={6} sm={4} md={3} key={club.id}>
                <StyledCard sx={{ cursor: "pointer" }} onClick={() => handleClubClick(club.id)}>
                  <CardContent>
                    <Typography variant="h6" align="center">
                      {club.name}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        {/* Existing Sections */}

        {/* Top Sponsor for Championship */}
        <Grid item xs={12}>
          <Typography variant="h5" color="primary" gutterBottom>
          Sponsor that sponsored the most number of national teams that won the
          World Championship
          </Typography>
          {topSponsor ? (
            <StyledCard>
              <CardContent>
                <Typography variant="h6">
                  Sponsor Name: <strong>{topSponsor.sponsor_name}</strong>
                </Typography>
                <Typography variant="body1">
                  National Teams Won: <strong>{topSponsor.national_teams_won}</strong>
                </Typography>
              </CardContent>
            </StyledCard>
          ) : (
            <Typography color="error">No sponsor data available for this championship.</Typography>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                Clubs with Most Euroleague Wins
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Club Name</TableCell>
                      <TableCell>Win Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clubsWithMostEuroleagueWins.length > 0 ? (
                      clubsWithMostEuroleagueWins.map((club) => (
                        <TableRow key={club.club_id}>
                          <TableCell>{club.club_name}</TableCell>
                          <TableCell>{club.win_count}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          No clubs found with more than three Euroleague wins.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

      <Dialog open={assistDialogOpen} onClose={() => setAssistDialogOpen(false)}>
        <DialogTitle>Top Assist Player</DialogTitle>
        <DialogContent>
          {topAssistPlayer ? (
            <Box>
              <Typography variant="h6">
                Player: <strong>{topAssistPlayer.player_name}</strong>
              </Typography>
              <Typography variant="body1">
                Club: <strong>{topAssistPlayer.club_name}</strong>
              </Typography>
              <Typography variant="body1">
                Average Assists per Game: {" "}
                <strong>{Number(topAssistPlayer.avg_assists_per_game).toFixed(2)}</strong>
              </Typography>
            </Box>
          ) : (
            <Typography color="error">No data available for this club.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PublicPage;