import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Candidate } from '@equal-vote/star-vote-shared/domain_model/Candidate';


interface BubbleGridProps {
  candidates: { score: number }[];
  columnValues: number[];
  columns: string[];
  numHeaderRows: number;
  instructionsRead: boolean;
  onClick: (candidateIndex: number, columnValue: number) => void;
  makeArea: (row: number, column: number, width?: number) => string;
  fontSX: object;
}

const BubbleGrid: React.FC<BubbleGridProps> = ({ candidates, columnValues, columns, numHeaderRows, instructionsRead, onClick, makeArea, fontSX }) => {



  // Step 1: Create a triplet of candidateIndex, columnIndex, and columnValue for each candidate

const candidateColumnPairsNested = useMemo(() => { 
  return candidates.map((_, candidateIndex) => 
    columnValues.map((columnValue, columnIndex) => 
      [candidateIndex, columnIndex, columnValue]
    )
  );}, [candidates, columnValues]);

  // Step 2: Flatten the nested array into a single array of triplets
  const candidateColumnPairsFlat = useMemo (() => candidateColumnPairsNested.flat(), [candidateColumnPairsNested]);

  // Step 3: Map over the flattened array to render the Box components
  return (
    <>
      {candidateColumnPairsFlat.map(([candidateIndex, columnIndex, columnValue]) => (
    <Box 
      key={`${candidateIndex}-${columnIndex}`}
      className={`circle ${columnValue === candidates[candidateIndex].score ? "filled" : ""} ${instructionsRead ? 'unblurred' : ''}`}
      onClick={() => onClick(candidateIndex, columnValue)}
      sx={{
        margin: 'auto',
        //For Rows:
        //numHeaderRows offsets grid to account for header rows
        //+1 offsets grid to account for candidateIndex starting at 0
        //+1 offsets grid to account for gutter row
        //*2 offsets grid to account for the two rows per candidate
        //For Columns:
        //+2 offsets grid to account for header column (candidate name)
        gridArea: makeArea(numHeaderRows + 1 + 1 + (2 * candidateIndex), 2 + columnIndex),
      }}
    >
      <Typography variant='body1' sx={{ ...fontSX }}> 
        {columns.length === 1 ? ' ' : columnValue} 
      </Typography>
    </Box>
  ))
}
    </>
  );
};

export default BubbleGrid;
