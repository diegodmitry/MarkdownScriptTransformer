import fs from 'fs';
import readline from 'readline';

// Path to the input markdown file
const inputFilePath = '../ptc.md';
// Path to the output shell script file
const outputFilePath = `./output_${inputFilePath.replace("../", "").replace(".md", "")}.sh`;

// Create a write stream for the output file
const outputStream = fs.createWriteStream(outputFilePath, { flags: 'w' });

const processFile = async () => {
  const fileStream = fs.createReadStream(inputFilePath);
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNumber = 0; // Keep track of the current line number

  for await (const line of rl) {
    lineNumber++; // Increment the line number with each iteration

    // Skip the first two lines
    if (lineNumber === 1 || lineNumber === 2) continue;

    if (line.startsWith('**')) {

      // Treat line as a comment and write to the output file
      // outputStream.write(`# ${line.substring(2)}\n`);

       // Remove "**" from the beginning and end of the line and treat it as a comment
      const cleanedLine = line.replace(/^\*\*|\*\*$/g, '').trim();
      const cleanedLineAtTheEnd = cleanedLine.replace(/\*\*$/, '').trim();

      console.log(cleanedLineAtTheEnd);
      outputStream.write(`# ${cleanedLineAtTheEnd}\n`);
       continue; // Skip further processing for comment lines
    } else {
      // Split the line by "|", filter out empty strings if any
      const parts = line.split('|').filter(Boolean);
      if (parts.length > 1) {
        const firstValue = parts[0].trim();
        const theLastOneValue = parts[parts.length - 1].trim();

        // Example of how to use the extracted values
        outputStream.write(`${firstValue}=${theLastOneValue}\n`);
      }
    }
  }

  outputStream.close();
};

processFile().catch(err => {
  console.error('An error occurred:', err);
  process.exit(1);
});
