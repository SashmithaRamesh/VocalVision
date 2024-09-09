import React from 'react';
import styled from 'styled-components';

const GameCard = ({ title, description, backgroundImage, route }) => {
    // Function to speak the title and description when hovered
    const handleMouseEnter = () => {
        const speechMessage = new SpeechSynthesisUtterance(`${title}. ${description}`);
        speechMessage.lang = 'en-IN';  // Set to Indian English
        speechMessage.rate = 1;  // Adjust the rate as needed
        window.speechSynthesis.speak(speechMessage);
    };

    // Function to stop speaking when the mouse leaves the card
    const handleMouseLeave = () => {
        window.speechSynthesis.cancel();
    };

    const handleCardClick = () => {
        window.location.href = route;
    };

    return (
        <CardWrapper
            style={{ backgroundImage: `url(${backgroundImage})` }}
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <ContentWrapper>
                <h3>{title}</h3>
                <p>{description}</p>
            </ContentWrapper>
        </CardWrapper>
    );
};

export default GameCard;

const CardWrapper = styled.div`
    width: 490px;
    height: 250px;
    margin: 20px;
    border-radius: 12px;
    background-size: cover;
    background-position: center;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
        filter: brightness(1.1);
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        transition: background 0.4s ease;
    }

    &:hover::after {
        background: rgba(0, 0, 0, 0.2);
    }
`;

const ContentWrapper = styled.div`
    position: absolute;
    text-align: center;
    z-index: 1;
    color: #fff;
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    width: 80%;
    bottom: 20px;

    h3 {
        margin: 0 0 10px 0;
        font-size: 28px;
        font-weight: 700;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
    }

    p {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
    }
`;
