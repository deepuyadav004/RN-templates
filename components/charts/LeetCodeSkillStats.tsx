import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/Colors';

interface LeetCodeSkillStatsProps {
  username: string;
}

interface TagProblemCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

interface SkillStatsData {
  data: {
    matchedUser: {
      tagProblemCounts: {
        advanced: TagProblemCount[];
        intermediate: TagProblemCount[];
        fundamental: TagProblemCount[];
      };
    };
  };
}

const LeetCodeSkillStats: React.FC<LeetCodeSkillStatsProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skillStats, setSkillStats] = useState<SkillStatsData | null>(null);

  useEffect(() => {
    const fetchLeetCodeSkillStats = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/skillStats/${username}`);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.data && data.data.matchedUser) {
          setSkillStats(data);
        } else {
          setError('Failed to fetch LeetCode skill statistics');
        }
      } catch (err) {
        console.error('Error fetching LeetCode skill stats:', err);
        setError('Failed to load LeetCode skill statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeSkillStats();
  }, [username]);

  const chartData = useMemo(() => {
    if (!skillStats) return null;
    
    const { advanced, intermediate, fundamental } = skillStats.data.matchedUser.tagProblemCounts;
    
    // Process advanced skills - take top 8 for better visualization
    const topAdvanced = [...advanced]
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 8);
    
    // Process intermediate skills - take top 10
    const topIntermediate = [...intermediate]
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 10);
    
    // Process fundamental skills - these are usually fewer so take all
    const sortedFundamental = [...fundamental]
      .sort((a, b) => b.problemsSolved - a.problemsSolved);
    
    return {
      advanced: topAdvanced,
      intermediate: topIntermediate,
      fundamental: sortedFundamental
    };
  }, [skillStats]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={styles.loadingText}>Loading LeetCode skill statistics...</Text>
      </View>
    );
  }

  if (error || !skillStats || !chartData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'No skill statistics available'}</Text>
      </View>
    );
  }

  // Create bar chart for advanced skills
  const advancedData = {
    labels: chartData.advanced.map(item => item.tagName.length > 10 ? 
      item.tagName.substring(0, 9) + '...' : item.tagName),
    datasets: [{
      data: chartData.advanced.map(item => item.problemsSolved)
    }]
  };

  // Create bar chart for intermediate skills
  const intermediateData = {
    labels: chartData.intermediate.map(item => item.tagName.length > 10 ? 
      item.tagName.substring(0, 9) + '...' : item.tagName),
    datasets: [{
      data: chartData.intermediate.map(item => item.problemsSolved)
    }]
  };

  // Create bar chart for fundamental skills
  const fundamentalData = {
    labels: chartData.fundamental.map(item => item.tagName.length > 10 ? 
      item.tagName.substring(0, 9) + '...' : item.tagName),
    datasets: [{
      data: chartData.fundamental.map(item => item.problemsSolved)
    }]
  };

  const screenWidth = Dimensions.get('window').width - 40;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Skill Statistics</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Advanced Skills */}
        <View style={styles.skillCategoryContainer}>
          <View style={[styles.categoryHeader, { backgroundColor: 'rgba(220, 53, 69, 0.1)' }]}>
            <View style={[styles.categoryIndicator, { backgroundColor: '#DC3545' }]} />
            <Text style={styles.categoryTitle}>Advanced Skills</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <BarChart
              data={advancedData}
              width={Math.max(screenWidth, advancedData.labels.length * 60)}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
              verticalLabelRotation={30}
              fromZero
            />
          </ScrollView>
          
          <View style={styles.skillDetailsContainer}>
            {chartData.advanced.slice(0, 5).map((skill, index) => (
              <View key={`adv-${index}`} style={styles.skillItem}>
                <Text style={styles.skillName} numberOfLines={1}>{skill.tagName}</Text>
                <View style={styles.skillBarContainer}>
                  <View 
                    style={[
                      styles.skillBar, 
                      { 
                        width: `${Math.min(100, (skill.problemsSolved / chartData.advanced[0].problemsSolved) * 100)}%`,
                        backgroundColor: '#DC3545' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.skillCount}>{skill.problemsSolved}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Intermediate Skills */}
        <View style={styles.skillCategoryContainer}>
          <View style={[styles.categoryHeader, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
            <View style={[styles.categoryIndicator, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.categoryTitle}>Intermediate Skills</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <BarChart
              data={intermediateData}
              width={Math.max(screenWidth, intermediateData.labels.length * 60)}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
              verticalLabelRotation={30}
              fromZero
            />
          </ScrollView>
          
          <View style={styles.skillDetailsContainer}>
            {chartData.intermediate.slice(0, 5).map((skill, index) => (
              <View key={`int-${index}`} style={styles.skillItem}>
                <Text style={styles.skillName} numberOfLines={1}>{skill.tagName}</Text>
                <View style={styles.skillBarContainer}>
                  <View 
                    style={[
                      styles.skillBar, 
                      { 
                        width: `${Math.min(100, (skill.problemsSolved / chartData.intermediate[0].problemsSolved) * 100)}%`,
                        backgroundColor: '#FFC107' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.skillCount}>{skill.problemsSolved}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Fundamental Skills */}
        <View style={styles.skillCategoryContainer}>
          <View style={[styles.categoryHeader, { backgroundColor: 'rgba(40, 167, 69, 0.1)' }]}>
            <View style={[styles.categoryIndicator, { backgroundColor: '#28A745' }]} />
            <Text style={styles.categoryTitle}>Fundamental Skills</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <BarChart
              data={fundamentalData}
              width={Math.max(screenWidth, fundamentalData.labels.length * 60)}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
              verticalLabelRotation={30}
              fromZero
            />
          </ScrollView>
          
          <View style={styles.skillDetailsContainer}>
            {chartData.fundamental.slice(0, 5).map((skill, index) => (
              <View key={`fund-${index}`} style={styles.skillItem}>
                <Text style={styles.skillName} numberOfLines={1}>{skill.tagName}</Text>
                <View style={styles.skillBarContainer}>
                  <View 
                    style={[
                      styles.skillBar, 
                      { 
                        width: `${Math.min(100, (skill.problemsSolved / chartData.fundamental[0].problemsSolved) * 100)}%`,
                        backgroundColor: '#28A745' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.skillCount}>{skill.problemsSolved}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.WHITE,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  skillCategoryContainer: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: '#333',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  skillDetailsContainer: {
    marginTop: 15,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skillName: {
    width: '25%',
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#555',
  },
  skillBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  skillBar: {
    height: '100%',
    borderRadius: 5,
  },
  skillCount: {
    width: 40,
    fontSize: 14,
    fontFamily: 'Gudea-Bold',
    color: '#333',
    textAlign: 'right',
  },
});

export default LeetCodeSkillStats;
