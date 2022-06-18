import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Scrollable = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: scroll !important;
  scroll-padding: 100px 0 0 100px;
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const HorizontalSpacer = styled.div`
  position: relative;
  height: 50%;
  width: 100%;
`;

export const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 50%;
  padding-right: 50%;
  box-sizing: content-box;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const BubbleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Bubblee = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    width: 100% !important;
    height: 100%;
  }
`;

export const GuideContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
`;

export const Guide = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.12);
`;
