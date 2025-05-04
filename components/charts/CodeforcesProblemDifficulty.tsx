import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';

interface ProblemSubmission {
  id: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    tags: string[];
    rating?: number;
  };
  verdict: string;
}

interface CodeforcesProblemDifficultyProps {
  username: string;
}

const CodeforcesProblemDifficulty: React.FC<CodeforcesProblemDifficultyProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<Record<string, number>>({});
  const [totalSolved, setTotalSolved] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.result && data.result.length > 0) {
          processSubmissions(data.result);
        } else {
          setError('No submission data available');
        }
      } catch (err) {
        setError('Failed to fetch submission data');
        console.error('Error fetching Codeforces submissions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [username]);
  
  const processSubmissions = (submissions: ProblemSubmission[]) => {
    const solvedProblems = new Map();
    const ratingCount: Record<string, number> = {
      '800-1000': 0,
      '1000-1200': 0,
      '1200-1400': 0,
      '1400-1600': 0,
      '1600-1800': 0,
      '1800-2000': 0,
      '2000-2200': 0,
      '2200-2500': 0,
      '2500+': 0,
      'Unknown': 0
    };
    
    submissions.forEach(submission => {
      if (submission.verdict === 'OK') {
        const problemKey = `${submission.problem.contestId}${submission.problem.index}`;
        if (!solvedProblems.has(problemKey)) {
          solvedProblems.set(problemKey, true);
          
          const rating = submission.problem.rating;
          if (rating) {
            if (rating <= 1000) {
              ratingCount['800-1000']++;
            } else if (rating <= 1200) {
              ratingCount['1000-1200']++;
            } else if (rating <= 1400) {
              ratingCount['1200-1400']++;
            } else if (rating <= 1600) {
              ratingCount['1400-1600']++;
            } else if (rating <= 1800) {
              ratingCount['1600-1800']++;
            } else if (rating <= 2000) {
              ratingCount['1800-2000']++;
            } else if (rating <= 2200) {
              ratingCount['2000-2200']++;
            } else if (rating <= 2500) {
              ratingCount['2200-2500']++;
            } else {
              ratingCount['2500+']++;
            }
          } else {
            ratingCount['Unknown']++;
          }
        }
      }
    });
    
    setRatingDistribution(ratingCount);
    setTotalSolved(solvedProblems.size);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={styles.loadingText}>Loading difficulty statistics...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  const ratingEntries = Object.entries(ratingDistribution).filter(([_, count]) => count > 0);
  
  if (ratingEntries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No solved problems found</Text>
      </View>
    );
  }

  // Prepare data for line chart
  const prepareLineChartData = () => {
    // Order difficulties for the chart
    const orderedDifficulties = [
      '800-1000', '1000-1200', '1200-1400', '1400-1600',
      '1600-1800', '1800-2000', '2000-2200', '2200-2500', '2500+'
    ];
    
    // Filter out 'Unknown' and sort the remaining entries
    const sortedEntries = ratingEntries
      .filter(([label]) => label !== 'Unknown')
      .sort((a, b) => {
        return orderedDifficulties.indexOf(a[0]) - orderedDifficulties.indexOf(b[0]);
      });
    
    return {
      labels: sortedEntries.map(([label]) => label),
      datasets: [
        {
          data: sortedEntries.map(([_, count]) => count),
          color: (opacity = 1) => `rgba(255, 127, 80, ${opacity})`, // coral
          strokeWidth: 2
        }
      ],
      legend: ["Problems Solved"]
    };
  };

  const lineData = prepareLineChartData();
  
  // Define colors for the legend
  const ratingColors = {
    'Unknown': '#AAAAAA',
    '800-1000': '#CCE2FF', // Newbie
    '1000-1200': '#77DDBB', // Pupil
    '1200-1400': '#44CC77', // Specialist
    '1400-1600': '#3388FF', // Expert
    '1600-1800': '#AAAA22', // CM
    '1800-2000': '#FFCC00', // Master
    '2000-2200': '#FF8800', // IM
    '2200-2500': '#FF3333', // GM
    '2500+': '#AA0000', // IGM
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartTitleContainer}>
        <Text style={styles.chartTitle}>Problems by Difficulty</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.totalSolvedText}>
          Total Problems Solved: <Text style={styles.totalSolvedValue}>{totalSolved}</Text>
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={lineData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backgroundGradientFrom: 'rgba(255, 255, 255, 0.9)',
            backgroundGradientTo: 'rgba(255, 255, 255, 0.9)',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 106, 78, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: Colors.CORAL,
            },
            propsForLabels: {
              fontSize: 10,
              fontFamily: 'Gudea-Regular',
              rotation: -45
            },
            propsForBackgroundLines: {
              stroke: 'rgba(0, 0, 0, 0.05)',
              strokeDasharray: '5, 5',
            },
          }}
          bezier
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
          withInnerLines={true}
          withOuterLines={false}
          withDots={true}
          withShadow={false}
          segments={5}
          fromZero={true}
        />
      </View>
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Difficulty Distribution</Text>
        <View style={styles.legendGrid}>
          {ratingEntries.map(([label, count]) => (
            <View key={label} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColorBox, 
                  { backgroundColor: ratingColors[label as keyof typeof ratingColors] || '#AAAAAA' }
                ]} 
              />
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendTag}>{label}</Text>
                <Text style={styles.legendCount}>
                  {count} ({Math.round((count / totalSolved) * 100)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 200, 200, 0.8)',
    borderRadius: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Gudea-Italic',
  },
  chartTitleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.WHITE,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 10,
    borderRadius: 10,
  },
  totalSolvedText: {
    fontSize: 15,
    fontFamily: 'Gudea-Regular',
    color: '#555',
  },
  totalSolvedValue: {
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
    fontSize: 17,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    width: '100%',
  },
  legendContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  legendTitle: {
    fontSize: 15,
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 5,
    borderRadius: 8,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    borderRadius: 6,
  },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 6,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendTag: {
    fontSize: 12,
    fontFamily: 'Gudea-Bold',
    color: '#444',
  },
  legendCount: {
    fontSize: 11,
    fontFamily: 'Gudea-Regular',
    color: '#666',
  },
});

export default CodeforcesProblemDifficulty;
