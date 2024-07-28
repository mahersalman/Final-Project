import React from 'react';
import styled from 'styled-components';
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <PageWrapper>
      <Navbar />
      <MainContent>
        <Title1>ברוכים הבאים </Title1>
        <Title>נתונים מהירים</Title>
        <InfoNote>
          <InfoIcon>i</InfoIcon>
          שימו לב יש ירידה חדשה בתפוקד העובדים בעמדת אריזה 12
        </InfoNote>
        <InfoCards>
          <Card color="#FFF1F0">
            <CardTitle>עובדים לא פעילים</CardTitle>
            <CardValue>4</CardValue>
            <CardSubtext>צפייה בפרטים {'>'}</CardSubtext>
          </Card>
          <Card color="#F0FAF9">
            <CardTitle>עובדים פעילים</CardTitle>
            <CardValue>41</CardValue>
            <CardSubtext>+1 today</CardSubtext>
            <CardSubtext>צפייה בפרטים {'>'}</CardSubtext>
          </Card>
        </InfoCards>
      </MainContent>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  font-family: Arial, sans-serif;
  direction: rtl;
  background-color: #FFFFFF;
  color: #000000;
`;

const MainContent = styled.main`
  padding: 1rem;
  text-align: center;
`;

const Title1 = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const InfoNote = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const InfoIcon = styled.span`
  background-color: #000000;
  color: #FFFFFF;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  font-size: 0.8rem;
`;

const InfoCards = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Card = styled.div`
  background-color: ${props => props.color};
  border-radius: 8px;
  padding: 1rem;
  width: 200px;
`;

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  margin-bottom: 0.5rem;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const CardSubtext = styled.div`
  font-size: 0.8rem;
  color: #666666;
`;

export default HomePage;
