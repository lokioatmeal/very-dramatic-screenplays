/**
 * Mock Screenplay Generator
 * 
 * This is a placeholder that returns hardcoded screenplay content
 * matching the Hallmark romantic comedy structure.
 * 
 * Later, this will be replaced with OpenAI API calls.
 */

export interface ScreenplayInput {
  protagonistName: string;
  setting: string;
  season: string;
  romanticInterest: string;
  adultThemed: boolean;
}

export interface ScreenplayOutput {
  title: string;
  content: string;
}

/**
 * Generates a mock screenplay based on input parameters
 */
export function generateScreenplay(input: ScreenplayInput): ScreenplayOutput {
  const { protagonistName, setting, season, romanticInterest, adultThemed } = input;
  
  const title = `${season} in ${setting}`.toUpperCase();
  
  // Mock screenplay following standard screenplay format
  const content = `${title}

Draft 1.0

FADE IN:

EXT. ${setting.toUpperCase()} - ${season.toUpperCase()} - DAY

The ${season.toLowerCase()} sun casts a warm glow over ${setting.toLowerCase()}. 
Locals bustle about their day, greeting each other with familiar waves.

${protagonistName.toUpperCase()} (30s, city-professional, stylish but 
stressed) arrives with overstuffed luggage and a phone pressed 
to their ear.

${protagonistName.toUpperCase()}
(into phone, frustrated)
I don't care about the merger, Brad. 
I'm taking the week off. Period.

${protagonistName.toUpperCase()} hangs up, takes a deep breath, then trips 
over a cobblestone.

INT. ${setting.toUpperCase()} COFFEE SHOP - CONTINUOUS

${romanticInterest.toUpperCase()} (30s, effortlessly charming, flannel-clad) 
catches ${protagonistName} before they fall. Their eyes meet.

${romanticInterest.toUpperCase()}
You okay? You must be new here. 
Nobody ever rushes in ${setting}.

${protagonistName.toUpperCase()}
(brushing off)
I'm fine. I don't need help.

${romanticInterest.toUpperCase()}
(smiling)
Suit yourself. Welcome to ${setting}.

${romanticInterest.toUpperCase()} walks away. ${protagonistName.toUpperCase()} watches, 
slightly intrigued but annoyed.

${adultThemed ? `
INT. ${protagonistName.toUpperCase()}'S RENTAL COTTAGE - NIGHT

${protagonistName.toUpperCase()} uncorks a bottle of wine, staring out 
at the moonlit ${setting.toLowerCase()}. The stress of city life 
begins to melt away. A soft knock at the door.

It's ${romanticInterest.toUpperCase()}, holding a basket.

${romanticInterest.toUpperCase()}
Thought you might need some local 
provisions. And maybe some company?

Their eyes linger. The tension is palpable.

${protagonistName.toUpperCase()}
(quietly)
Come in.
` : `
INT. ${setting.toUpperCase()} COMMUNITY CENTER - DAY

${protagonistName.toUpperCase()} reluctantly volunteers for the town's 
${season.toLowerCase()} festival. ${romanticInterest.toUpperCase()} is there, organizing 
everything with ease and humor.

${romanticInterest.toUpperCase()}
So, city person, ever decorated 
a town square before?

${protagonistName.toUpperCase()}
(defensive, but smiling)
I'll have you know I'm very capable.

They work side-by-side, growing closer with each passing moment.
`}

EXT. ${setting.toUpperCase()} TOWN SQUARE - ${season.toUpperCase()} EVENING

The festival is in full swing. Lights twinkle. Music plays. 
${protagonistName.toUpperCase()} and ${romanticInterest.toUpperCase()} stand together, watching 
the community they've brought together.

${romanticInterest.toUpperCase()}
You know, you've changed since 
you got here.

${protagonistName.toUpperCase()}
(softly)
Maybe ${setting} changed me. 
Or maybe... you did.

They kiss as snow/leaves/petals fall around them.

${protagonistName.toUpperCase()} (V.O.)
I came to ${setting} to escape. 
But what I found was home.

FADE OUT.

THE END`;

  return {
    title,
    content
  };
}
