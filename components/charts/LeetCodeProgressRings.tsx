import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

interface LeetCodeProgressRingsProps {
  username: string;
}

interface LeetCodeStats {
  status: string;
  message: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
}

const ProgressRing = ({ 
  progress, 
  size, 
  strokeWidth, 
  color, 
  backgroundColor = "#E0E0E0",
  label,
  solved,
  total
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressStrokeDashoffset = circumference - (circumference * progress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={backgroundColor}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressStrokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
        
        {/* Label */}
        <G>
          <SvgText
            x={size / 2}
            y={(size / 2) - 5}
            textAnchor="middle"
            fontSize={14}
            fontFamily="Gudea-Bold"
            fill="#333"
          >
            {label}
          </SvgText>
          <SvgText
            x={size / 2}
            y={(size / 2) + 20}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fill="#333"
          >
            {`${solved}/${total}`}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const LeetCodeProgressRings: React.FC<LeetCodeProgressRingsProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<LeetCodeStats | null>(null);

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.status === 'success') {
          setStats(data);
        } else {
          setError('Failed to fetch LeetCode statistics');
        }
      } catch (err) {
        console.error('Error fetching LeetCode stats:', err);
        setError('Failed to load LeetCode statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeStats();
  }, [username]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.CORAL} />
        <Text style={styles.loadingText}>Loading LeetCode statistics...</Text>
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Failed to load data'}</Text>
      </View>
    );
  }

  // Calculate percentages
  const easyPercentage = stats.easySolved / stats.totalEasy;
  const mediumPercentage = stats.mediumSolved / stats.totalMedium;
  const hardPercentage = stats.hardSolved / stats.totalHard;
  const totalPercentage = stats.totalSolved / stats.totalQuestions;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Problem Solving Progress</Text>
      </View>
      
      <View style={styles.statsOverview}>
        <Text style={styles.overallProgress}>
          Overall: {stats.totalSolved} / {stats.totalQuestions} ({Math.round(totalPercentage * 100)}%)
        </Text>
        <Text style={styles.rankText}>
          Global Rank: <Text style={styles.rankValue}>{stats.ranking.toLocaleString()}</Text>
        </Text>
      </View>
      
      <View style={styles.ringContainer}>
        <ProgressRing
          progress={easyPercentage}
          size={110}
          strokeWidth={12}
          color="#5CB85C" // Green for Easy
          label="Easy"
          solved={stats.easySolved}
          total={stats.totalEasy}
        />
        
        <ProgressRing
          progress={mediumPercentage}
          size={110}
          strokeWidth={12}
          color="#F0AD4E" // Orange for Medium
          label="Medium"
          solved={stats.mediumSolved}
          total={stats.totalMedium}
        />
        
        <ProgressRing
          progress={hardPercentage}
          size={110}
          strokeWidth={12}
          color="#D9534F" // Red for Hard
          label="Hard"
          solved={stats.hardSolved}
          total={stats.totalHard}
        />
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={[styles.detailItem, { backgroundColor: 'rgba(92, 184, 92, 0.15)' }]}>
          <Text style={styles.detailLabel}>Easy</Text>
          <Text style={[styles.detailValue, { color: '#5CB85C' }]}>
            {Math.round(easyPercentage * 100)}%
          </Text>
        </View>
        
        <View style={[styles.detailItem, { backgroundColor: 'rgba(240, 173, 78, 0.15)' }]}>
          <Text style={styles.detailLabel}>Medium</Text>
          <Text style={[styles.detailValue, { color: '#F0AD4E' }]}>
            {Math.round(mediumPercentage * 100)}%
          </Text>
        </View>
        
        <View style={[styles.detailItem, { backgroundColor: 'rgba(217, 83, 79, 0.15)' }]}>
          <Text style={styles.detailLabel}>Hard</Text>
          <Text style={[styles.detailValue, { color: '#D9534F' }]}>
            {Math.round(hardPercentage * 100)}%
          </Text>
        </View>
      </View>
      
      <View style={styles.additionalStatsContainer}>
        <View style={styles.additionalStatItem}>
          <Text style={styles.additionalStatLabel}>Acceptance Rate</Text>
          <Text style={styles.additionalStatValue}>{stats.acceptanceRate}%</Text>
        </View>
        
        <View style={styles.additionalStatItem}>
          <Text style={styles.additionalStatLabel}>Contribution</Text>
          <Text style={styles.additionalStatValue}>{stats.contributionPoints}</Text>
        </View>
        
        <View style={styles.additionalStatItem}>
          <Text style={styles.additionalStatLabel}>Reputation</Text>
          <Text style={styles.additionalStatValue}>{stats.reputation}</Text>
        </View>
      </View>
      
      <View style={styles.detailedStatsCard}>
        <Text style={styles.detailedStatsTitle}>LeetCode Profile Statistics</Text>
        
        <View style={styles.detailedStatRow}>
          <View style={styles.detailedStatItem}>
            <View style={styles.statIconContainer}>
              <View style={[styles.statIcon, { backgroundColor: Colors.CORAL }]}>
                <Text style={styles.statIconText}>🏆</Text>
              </View>
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Global Ranking</Text>
              <Text style={styles.statValue}>{stats.ranking.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.detailedStatItem}>
            <View style={styles.statIconContainer}>
              <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.statIconText}>✓</Text>
              </View>
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Acceptance Rate</Text>
              <Text style={styles.statValue}>{stats.acceptanceRate}%</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.detailedStatRow}>
          <View style={styles.detailedStatItem}>
            <View style={styles.statIconContainer}>
              <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.statIconText}>⭐</Text>
              </View>
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Contribution Points</Text>
              <Text style={styles.statValue}>{stats.contributionPoints.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.detailedStatItem}>
            <View style={styles.statIconContainer}>
              <View style={[styles.statIcon, { backgroundColor: '#9C27B0' }]}>
                <Text style={styles.statIconText}>👑</Text>
              </View>
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Reputation</Text>
              <Text style={styles.statValue}>{stats.reputation.toLocaleString()}</Text>
            </View>
          </View>
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
  statsOverview: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
  },
  overallProgress: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: '#444',
    marginBottom: 5,
  },
  rankText: {
    fontSize: 14,
    fontFamily: 'Gudea-Regular',
    color: '#666',
  },
  rankValue: {
    fontFamily: 'Gudea-Bold',
    color: Colors.DARK_GREEN,
  },
  ringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Gudea-Bold',
    color: '#555',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
  },
  additionalStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  additionalStatItem: {
    alignItems: 'center',
  },
  additionalStatLabel: {
    fontSize: 13,
    fontFamily: 'Gudea-Regular',
    color: '#666',
    marginBottom: 5,
  },
  additionalStatValue: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: Colors.CORAL,
  },
  detailedStatsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailedStatsTitle: {
    fontSize: 16,
    fontFamily: 'Gudea-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailedStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailedStatItem: {
    flexDirection: 'row',
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 10,
    padding: 10,
  },
  statIconContainer: {
    marginRight: 10,
    justifyContent: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconText: {
    fontSize: 16,
    color: 'white',
  },
  statTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Gudea-Regular',
    color: '#777',
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'Gudea-Bold',
    color: '#333',
  },
});

export default LeetCodeProgressRings;
