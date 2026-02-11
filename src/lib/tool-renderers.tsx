import { GeneratorCard as PasswordGenerator } from "@/components/password-generator/generator-card";
import { LoremGenerator } from "@/components/lorem-ipsum/lorem-generator";
import { FontGenerator } from "@/components/fonts/font-generator";
import { QRGenerator } from "@/components/qr-generator/qr-generator";
import { NumberGenerator } from "@/components/random-number/number-generator";
import { NumbersGenerator } from "@/components/random-numbers/numbers-generator";
import { YesNoGenerator } from "@/components/random-yesno/yesno-generator";
import { DiceRoller } from "@/components/dice/dice-roller";
import { TarotReader } from "@/components/tarot/tarot-reader";
import { CharacterCounter } from "@/components/text-counter/character-counter";
import { WordCounter } from "@/components/text-counter/word-counter";
import { CountdownVacation } from "@/components/countdown/countdown-vacation";
import { CountdownChristmas } from "@/components/countdown/countdown-christmas";
import { CountdownDate } from "@/components/countdown/countdown-date";
import { WhiteScreenTool } from "@/components/white-screen/white-screen-tool";
import { AmountInWords } from "@/components/amount-in-words/amount-in-words";
import { CaesarCipher } from "@/components/caesar-cipher/caesar-cipher";
import { PdfConverter } from "@/components/pdf-converter/pdf-converter";
import { PdfToWordConverter } from "@/components/pdf-converter/pdf-to-word-converter";
import { BMICalculator } from "@/components/calculators/bmi-calculator";
import { ProportionCalculator } from "@/components/calculators/proportion-calculator";
import { WeightedAverageCalculator } from "@/components/calculators/weighted-average-calculator";
import { SleepCalculator } from "@/components/calculators/sleep-calculator";
import { CalorieCalculator } from "@/components/calculators/calorie-calculator";
import { BloodTypeCalculator } from "@/components/calculators/blood-type-calculator";
import { InflationCalculator } from "@/components/calculators/inflation-calculator";
import { DogYearsCalculator } from "@/components/calculators/dog-years-calculator";
import { RomanNumeralsCalculator } from "@/components/calculators/roman-numerals-calculator";
import { CatYearsCalculator } from "@/components/calculators/cat-years-calculator";
import { ToolPlaceholder } from "@/components/layout/tool-placeholder";

export function renderToolComponent(
  toolId: string,
  isReady: boolean,
  toolDict: any,
  commonDict: { copy: string; copied: string },
  locale: string = "pl"
): React.ReactNode {
  if (!isReady) {
    return <ToolPlaceholder name={toolDict?.name || toolId} />;
  }

  switch (toolId) {
    // Generators
    case "password-generator":
      return <PasswordGenerator />;
    case "lorem-ipsum":
      return (
        <LoremGenerator
          dictionary={{
            paragraphs: toolDict.paragraphs || "Paragraphs",
            sentences: toolDict.sentences || "Sentences",
            words: toolDict.words || "Words",
            count: toolDict.count || "Count",
            generate: toolDict.generate || "Generate",
            copy: commonDict.copy,
            copied: commonDict.copied,
          }}
        />
      );
    case "font-generator":
      return (
        <FontGenerator
          dictionary={{
            title: toolDict.title || "Font Generator",
            subtitle: toolDict.subtitle || "Preview text in different fonts",
            placeholder: toolDict.placeholder || "Type your text...",
            defaultText: toolDict.defaultText || "Your text here",
            fontSize: toolDict.fontSize || "Font size",
            allFonts: toolDict.allFonts || "All fonts",
            serif: toolDict.serif || "Serif",
            sansSerif: toolDict.sansSerif || "Sans-serif",
            display: toolDict.display || "Display",
            handwriting: toolDict.handwriting || "Handwriting",
            monospace: toolDict.monospace || "Monospace",
            copyFont: toolDict.copyFont || "Copy font name",
            copied: toolDict.copied || "Copied!",
            fontPairings: toolDict.fontPairings || "Font pairings",
            heading: toolDict.heading || "Heading",
            body: toolDict.body || "Body",
            searchFonts: toolDict.searchFonts || "Search fonts...",
            noResults: toolDict.noResults || "No fonts found",
            googleFonts: toolDict.googleFonts || "Google Fonts",
          }}
        />
      );
    case "qr-generator":
      return (
        <QRGenerator
          dictionary={{
            title: toolDict.title || "QR Code Generator",
            subtitle: toolDict.subtitle || "Create QR codes",
            inputLabel: toolDict.inputLabel || "Text or URL",
            inputPlaceholder: toolDict.inputPlaceholder || "Enter text, URL...",
            generate: toolDict.generate || "Generate QR code",
            download: toolDict.download || "Download PNG",
            size: toolDict.size || "Size",
            clear: toolDict.clear || "Clear",
            preview: toolDict.preview || "QR code preview",
            noContent: toolDict.noContent || "Enter content to generate QR code",
          }}
        />
      );

    // Randomizers
    case "random-number":
      return (
        <NumberGenerator
          dictionary={{
            min: toolDict.min || "Minimum",
            max: toolDict.max || "Maximum",
            result: toolDict.result || "Result",
            generate: toolDict.generate || "Generate",
            copy: commonDict.copy,
            copied: commonDict.copied,
          }}
        />
      );
    case "random-numbers":
      return (
        <NumbersGenerator
          dictionary={{
            min: toolDict.min || "Minimum",
            max: toolDict.max || "Maximum",
            count: toolDict.count || "Count",
            unique: toolDict.unique || "Unique",
            sorted: toolDict.sorted || "Sorted",
            results: toolDict.results || "Results",
            generate: toolDict.generate || "Generate",
            copyAll: toolDict.copyAll || "Copy all",
            copy: commonDict.copy,
            copied: commonDict.copied,
          }}
        />
      );
    case "random-yesno":
      return (
        <YesNoGenerator
          dictionary={{
            yes: toolDict.yes || "YES",
            no: toolDict.no || "NO",
            askQuestion: toolDict.askQuestion || "Ask a question",
            questionPlaceholder: toolDict.questionPlaceholder || "Type your question...",
            generate: toolDict.generate || "Generate",
            result: toolDict.result || "Result",
            tryAgain: toolDict.tryAgain || "Try again",
          }}
        />
      );
    case "dice-roll":
      return (
        <DiceRoller
          dictionary={{
            title: toolDict.title || "Dice Roller",
            subtitle: toolDict.subtitle || "Virtual dice roller online",
            roll: toolDict.roll || "Roll dice",
            rolling: toolDict.rolling || "Rolling...",
            result: toolDict.result || "Result",
            total: toolDict.total || "Total",
            numberOfDice: toolDict.numberOfDice || "Number of dice",
            diceType: toolDict.diceType || "Dice type",
            history: toolDict.history || "Roll history",
            clearHistory: toolDict.clearHistory || "Clear history",
            sides: toolDict.sides || "sides",
            average: toolDict.average || "Average",
            min: toolDict.min || "Min",
            max: toolDict.max || "Max",
          }}
        />
      );
    case "random-tarot":
      return (
        <TarotReader
          locale={locale}
          dictionary={{
            title: toolDict.title || "Tarot Card Draw",
            subtitle: toolDict.subtitle || "Draw a card from the 78 card deck",
            draw: toolDict.draw || "Draw a Card",
            drawAnother: toolDict.drawAnother || "Draw Another",
            upright: toolDict.upright || "Upright",
            reversed: toolDict.reversed || "Reversed",
            meaning: toolDict.meaning || "Meaning",
            keywords: toolDict.keywords || "Keywords",
            history: toolDict.history || "Draw history",
            clearHistory: toolDict.clearHistory || "Clear history",
            majorArcana: toolDict.majorArcana || "Major Arcana",
            minorArcana: toolDict.minorArcana || "Minor Arcana",
            cardOf: toolDict.cardOf || "Card",
            of78: toolDict.of78 || "of 78",
            clickToReveal: toolDict.clickToReveal || "Click to reveal",
            noHistory: toolDict.noHistory || "No history",
            imageDesc: toolDict.imageDesc || "Card description",
            love: toolDict.love || "Love",
            health: toolDict.health || "Health",
            work: toolDict.work || "Work",
            adviceLabel: toolDict.adviceLabel || "Advice",
            element: toolDict.element || "Element",
            zodiacLabel: toolDict.zodiacLabel || "Zodiac",
            planetLabel: toolDict.planetLabel || "Planet",
          }}
        />
      );

    // Tools (narzedzia)
    case "character-counter":
      return (
        <CharacterCounter
          dictionary={{
            title: toolDict.title || "Character Counter",
            subtitle: toolDict.subtitle || "Count characters in text",
            placeholder: toolDict.placeholder || "Type or paste text...",
            characters: toolDict.characters || "Characters",
            charactersNoSpaces: toolDict.charactersNoSpaces || "Characters (no spaces)",
            words: toolDict.words || "Words",
            sentences: toolDict.sentences || "Sentences",
            paragraphs: toolDict.paragraphs || "Paragraphs",
            readingTime: toolDict.readingTime || "Reading time",
            speakingTime: toolDict.speakingTime || "Speaking time",
            minutes: toolDict.minutes || "min",
            seconds: toolDict.seconds || "sec",
            clear: toolDict.clear || "Clear",
            copy: toolDict.copy || "Copy text",
          }}
        />
      );
    case "word-counter":
      return (
        <WordCounter
          dictionary={{
            title: toolDict.title || "Word Counter",
            subtitle: toolDict.subtitle || "Count words and analyze text",
            placeholder: toolDict.placeholder || "Type or paste text...",
            words: toolDict.words || "Words",
            uniqueWords: toolDict.uniqueWords || "Unique words",
            characters: toolDict.characters || "Characters",
            sentences: toolDict.sentences || "Sentences",
            paragraphs: toolDict.paragraphs || "Paragraphs",
            avgWordLength: toolDict.avgWordLength || "Avg word length",
            avgSentenceLength: toolDict.avgSentenceLength || "Avg sentence length",
            readingTime: toolDict.readingTime || "Reading time",
            speakingTime: toolDict.speakingTime || "Speaking time",
            minutes: toolDict.minutes || "min",
            seconds: toolDict.seconds || "sec",
            wordsLabel: toolDict.wordsLabel || "words",
            clear: toolDict.clear || "Clear",
            copy: toolDict.copy || "Copy text",
            topWords: toolDict.topWords || "Top words",
          }}
        />
      );
    case "countdown-vacation":
      return (
        <CountdownVacation
          dictionary={{
            title: toolDict.title || "Vacation Countdown",
            subtitle: toolDict.subtitle || "How much time until summer vacation?",
            days: toolDict.days || "days",
            hours: toolDict.hours || "hours",
            minutes: toolDict.minutes || "minutes",
            seconds: toolDict.seconds || "seconds",
            vacationStart: toolDict.vacationStart || "Vacation start",
            timeLeft: toolDict.timeLeft || "Time left",
            vacationStarted: toolDict.vacationStarted || "Vacation has started!",
            enjoy: toolDict.enjoy || "Enjoy your free time!",
          }}
        />
      );
    case "countdown-christmas":
      return (
        <CountdownChristmas
          dictionary={{
            title: toolDict.title || "Christmas Countdown",
            subtitle: toolDict.subtitle || "How long until Christmas?",
            days: toolDict.days || "days",
            hours: toolDict.hours || "hours",
            minutes: toolDict.minutes || "minutes",
            seconds: toolDict.seconds || "seconds",
            christmasDate: toolDict.christmasDate || "Christmas Eve",
            timeLeft: toolDict.timeLeft || "Time left",
            christmasNow: toolDict.christmasNow || "Merry Christmas!",
            merryChristmas: toolDict.merryChristmas || "Christmas time is here!",
          }}
        />
      );
    case "countdown-date":
      return (
        <CountdownDate
          dictionary={{
            title: toolDict.title || "Date Countdown",
            subtitle: toolDict.subtitle || "Count down to any event",
            days: toolDict.days || "days",
            hours: toolDict.hours || "hours",
            minutes: toolDict.minutes || "minutes",
            seconds: toolDict.seconds || "seconds",
            selectDate: toolDict.selectDate || "Select date",
            eventName: toolDict.eventName || "Event name (optional)",
            eventPlaceholder: toolDict.eventPlaceholder || "e.g. My birthday",
            timeLeft: toolDict.timeLeft || "Time left",
            dateReached: toolDict.dateReached || "Date has passed!",
            timeSince: toolDict.timeSince || "Time since this event",
          }}
        />
      );
    case "white-screen":
      return (
        <WhiteScreenTool
          dictionary={{
            title: toolDict.title || "White Screen",
            subtitle: toolDict.subtitle || "Full-screen color display",
            fullscreen: toolDict.fullscreen || "Fullscreen",
            exitFullscreen: toolDict.exitFullscreen || "Exit fullscreen",
            pixelTest: toolDict.pixelTest || "Pixel test",
            stopTest: toolDict.stopTest || "Click to stop test",
            customColor: toolDict.customColor || "Custom color (HEX)",
            clickToExit: toolDict.clickToExit || "Click to exit",
            presets: toolDict.presets || "Preset colors",
            currentColor: toolDict.currentColor || "Current color",
          }}
        />
      );
    case "amount-in-words":
      return (
        <AmountInWords
          dictionary={{
            title: toolDict.title || "Amount in Words",
            subtitle: toolDict.subtitle || "Convert numbers to words",
            inputLabel: toolDict.inputLabel || "Enter number",
            inputPlaceholder: toolDict.inputPlaceholder || "e.g. 1234.56",
            result: toolDict.result || "Result in words",
            copy: toolDict.copy || "Copy",
            copied: toolDict.copied || "Copied!",
            clear: toolDict.clear || "Clear",
            currency: toolDict.currency || "Currency mode (PLN)",
            numberOnly: toolDict.numberOnly || "Number only",
          }}
        />
      );
    case "caesar-cipher":
      return (
        <CaesarCipher
          dictionary={{
            title: toolDict.title || "Caesar Cipher",
            subtitle: toolDict.subtitle || "Encrypt and decrypt text with letter shift",
            inputLabel: toolDict.inputLabel || "Text to encrypt",
            inputPlaceholder: toolDict.inputPlaceholder || "Enter text...",
            result: toolDict.result || "Result",
            shift: toolDict.shift || "Shift",
            encrypt: toolDict.encrypt || "Encrypt",
            decrypt: toolDict.decrypt || "Decrypt",
            copy: toolDict.copy || "Copy",
            copied: toolDict.copied || "Copied!",
            clear: toolDict.clear || "Clear",
          }}
        />
      );

    // Converters
    case "pdf-to-jpg":
      return (
        <PdfConverter
          format="jpg"
          dictionary={{
            uploadTitle: toolDict.uploadTitle || "Select PDF file",
            uploadDescription: toolDict.uploadDescription || "Drag file or click to select",
            dropHere: toolDict.dropHere || "Drop file here",
            selectFile: toolDict.selectFile || "Select file",
            orDragDrop: toolDict.orDragDrop || "or drag and drop",
            maxSize: toolDict.maxSize || "Max size: 50MB",
            scale: toolDict.scale || "Scale",
            quality: toolDict.quality || "Quality",
            processing: toolDict.processing || "Processing",
            page: toolDict.page || "Page",
            downloadPage: toolDict.downloadPage || "Download page",
            downloadAll: toolDict.downloadAll || "Download all",
            converting: toolDict.converting || "Converting",
            of: toolDict.of || "of",
            newFile: toolDict.newFile || "New file",
          }}
        />
      );
    case "pdf-to-png":
      return (
        <PdfConverter
          format="png"
          dictionary={{
            uploadTitle: toolDict.uploadTitle || "Select PDF file",
            uploadDescription: toolDict.uploadDescription || "Drag file or click to select",
            dropHere: toolDict.dropHere || "Drop file here",
            selectFile: toolDict.selectFile || "Select file",
            orDragDrop: toolDict.orDragDrop || "or drag and drop",
            maxSize: toolDict.maxSize || "Max size: 50MB",
            scale: toolDict.scale || "Scale",
            quality: toolDict.quality || "Quality",
            processing: toolDict.processing || "Processing",
            page: toolDict.page || "Page",
            downloadPage: toolDict.downloadPage || "Download page",
            downloadAll: toolDict.downloadAll || "Download all",
            converting: toolDict.converting || "Converting",
            of: toolDict.of || "of",
            newFile: toolDict.newFile || "New file",
          }}
        />
      );
    case "pdf-to-word":
      return (
        <PdfToWordConverter
          dictionary={{
            title: toolDict.title || "PDF to Word",
            subtitle: toolDict.subtitle || "Extract text from PDF and save as Word",
            selectFile: toolDict.selectFile || "Select PDF file",
            dragDrop: toolDict.dragDrop || "or drag and drop",
            dropHere: toolDict.dropHere || "Drop file here",
            maxSize: toolDict.maxSize || "Max size: 50MB",
            convert: toolDict.convert || "Convert to Word",
            download: toolDict.download || "Download DOCX",
            converting: toolDict.converting || "Converting",
            extracting: toolDict.extracting || "Extracting text",
            generating: toolDict.generating || "Generating Word document",
            page: toolDict.page || "Page",
            of: toolDict.of || "of",
            done: toolDict.done || "Done!",
            error: toolDict.error || "An error occurred",
            newFile: toolDict.newFile || "New file",
            textOnly: toolDict.textOnly || "This tool extracts text only.",
            noText: toolDict.noText || "No text found in PDF.",
            pages: toolDict.pages || "pages",
          }}
        />
      );

    // Calculators
    case "bmi-calculator":
      return (
        <BMICalculator
          dictionary={{
            title: toolDict.title || "BMI Calculator",
            subtitle: toolDict.subtitle || "Calculate your body mass index",
            weight: toolDict.weight || "Weight (kg)",
            height: toolDict.height || "Height (cm)",
            calculate: toolDict.calculate || "Calculate BMI",
            result: toolDict.result || "Your BMI",
            category: toolDict.category || "Category",
            underweight: toolDict.underweight || "Underweight",
            normal: toolDict.normal || "Normal weight",
            overweight: toolDict.overweight || "Overweight",
            obese: toolDict.obese || "Obesity Class I",
            severelyObese: toolDict.severelyObese || "Obesity Class II",
            morbidlyObese: toolDict.morbidlyObese || "Obesity Class III",
            clear: toolDict.clear || "Clear",
          }}
        />
      );
    case "proportion-calculator":
      return (
        <ProportionCalculator
          dictionary={{
            title: toolDict.title || "Proportion Calculator",
            subtitle: toolDict.subtitle || "Solve proportion equations",
            formula: toolDict.formula || "A / B = C / X",
            valueA: toolDict.valueA || "Value A",
            valueB: toolDict.valueB || "Value B",
            valueC: toolDict.valueC || "Value C",
            valueX: toolDict.valueX || toolDict.result || "Result (X)",
            calculate: toolDict.calculate || "Calculate",
            result: toolDict.result || "Result",
            copy: commonDict.copy,
            clear: toolDict.clear || "Clear",
          }}
        />
      );
    case "weighted-average":
      return (
        <WeightedAverageCalculator
          dictionary={{
            title: toolDict.title || "Weighted Average Calculator",
            subtitle: toolDict.subtitle || "Calculate weighted average",
            value: toolDict.value || "Value",
            weight: toolDict.weight || "Weight",
            addRow: toolDict.addRow || "Add row",
            removeRow: toolDict.removeRow || "Remove",
            calculate: toolDict.calculate || "Calculate average",
            result: toolDict.result || "Weighted average",
            sumOfWeights: toolDict.sumOfWeights || "Sum of weights",
            clear: toolDict.clear || "Clear all",
            copy: toolDict.copy || "Copy result",
            example: toolDict.example || "Example",
            loadExample: toolDict.loadExample || "Load example",
          }}
        />
      );
    case "sleep-calculator":
      return (
        <SleepCalculator
          dictionary={{
            title: toolDict.title || "Sleep Calculator",
            subtitle: toolDict.subtitle || "Calculate optimal sleep or wake time",
            wakeUpAt: toolDict.wakeUpAt || "I want to wake up at...",
            fallAsleepAt: toolDict.fallAsleepAt || "I want to fall asleep at...",
            calculate: toolDict.calculate || "Calculate",
            clear: toolDict.clear || "Clear",
            cycles: toolDict.cycles || "cycles",
            hours: toolDict.hours || "hours",
            optimal: toolDict.optimal || "Optimal",
            good: toolDict.good || "Good",
            minimum: toolDict.minimum || "Minimum",
            timeToFallAsleep: toolDict.timeToFallAsleep || "Time to fall asleep",
            results: toolDict.results || "Results",
            bedtimeResults: toolDict.bedtimeResults || "You should go to bed at:",
            wakeUpResults: toolDict.wakeUpResults || "You should wake up at:",
          }}
        />
      );
    case "calorie-calculator":
      return (
        <CalorieCalculator
          dictionary={{
            title: toolDict.title || "Calorie Calculator",
            subtitle: toolDict.subtitle || "Calculate daily calorie needs",
            gender: toolDict.gender || "Gender",
            male: toolDict.male || "Male",
            female: toolDict.female || "Female",
            age: toolDict.age || "Age (years)",
            weight: toolDict.weight || "Weight (kg)",
            height: toolDict.height || "Height (cm)",
            activityLevel: toolDict.activityLevel || "Activity level",
            sedentary: toolDict.sedentary || "Sedentary",
            lightlyActive: toolDict.lightlyActive || "Lightly active",
            moderatelyActive: toolDict.moderatelyActive || "Moderately active",
            veryActive: toolDict.veryActive || "Very active",
            extremelyActive: toolDict.extremelyActive || "Extremely active",
            calculate: toolDict.calculate || "Calculate calories",
            clear: toolDict.clear || "Clear",
            bmr: toolDict.bmr || "BMR",
            bmrDesc: toolDict.bmrDesc || "Basal metabolic rate",
            tdee: toolDict.tdee || "TDEE",
            tdeeDesc: toolDict.tdeeDesc || "Total daily energy expenditure",
            loseWeight: toolDict.loseWeight || "Lose weight",
            slowCut: toolDict.slowCut || "Slow cut",
            maintenance: toolDict.maintenance || "Maintenance",
            leanBulk: toolDict.leanBulk || "Lean bulk",
            bulk: toolDict.bulk || "Bulk",
            protein: toolDict.protein || "Protein",
            carbs: toolDict.carbs || "Carbs",
            fat: toolDict.fat || "Fat",
            kcalPerDay: toolDict.kcalPerDay || "kcal/day",
            weeklyChange: toolDict.weeklyChange || "Weekly",
            goalResults: toolDict.goalResults || "Calorie goals",
            macros: toolDict.macros || "Macronutrients",
          }}
        />
      );
    case "blood-type-calculator":
      return (
        <BloodTypeCalculator
          dictionary={{
            title: toolDict.title || "Blood Type Calculator",
            subtitle: toolDict.subtitle || "Calculate possible child blood type",
            parent1: toolDict.parent1 || "Parent 1",
            parent2: toolDict.parent2 || "Parent 2",
            bloodGroup: toolDict.bloodGroup || "Blood group (ABO)",
            rhFactor: toolDict.rhFactor || "Rh factor",
            calculate: toolDict.calculate || "Calculate blood type",
            clear: toolDict.clear || "Clear",
            results: toolDict.results || "Results",
            probability: toolDict.probability || "Probability",
            possibleTypes: toolDict.possibleTypes || "Possible blood types",
            noResults: toolDict.noResults || "No results",
          }}
        />
      );
    case "inflation-calculator":
      return (
        <InflationCalculator
          dictionary={{
            title: toolDict.title || "Inflation Calculator",
            subtitle: toolDict.subtitle || "Calculate inflation impact",
            amount: toolDict.amount || "Amount",
            inflationRate: toolDict.inflationRate || "Annual inflation (%)",
            years: toolDict.years || "Number of years",
            calculate: toolDict.calculate || "Calculate",
            clear: toolDict.clear || "Clear",
            futureValue: toolDict.futureValue || "Equivalent value",
            purchasingPowerLoss: toolDict.purchasingPowerLoss || "Purchasing power loss",
            purchasingPowerPercent: toolDict.purchasingPowerPercent || "Value loss",
            yearByYear: toolDict.yearByYear || "Year by year",
            year: toolDict.year || "Year",
            value: toolDict.value || "Value",
            loss: toolDict.loss || "Loss",
          }}
        />
      );
    case "dog-years-calculator":
      return (
        <DogYearsCalculator
          dictionary={{
            title: toolDict.title || "Dog Years Calculator",
            subtitle: toolDict.subtitle || "Convert dog age to human years",
            dogAge: toolDict.dogAge || "Dog age (years)",
            dogSize: toolDict.dogSize || "Dog size",
            small: toolDict.small || "Small",
            smallDesc: toolDict.smallDesc || "e.g. Yorkie, Chihuahua",
            medium: toolDict.medium || "Medium",
            mediumDesc: toolDict.mediumDesc || "e.g. Beagle, Bulldog",
            large: toolDict.large || "Large",
            largeDesc: toolDict.largeDesc || "e.g. Labrador, Husky",
            giant: toolDict.giant || "Giant",
            giantDesc: toolDict.giantDesc || "e.g. Great Dane",
            calculate: toolDict.calculate || "Calculate age",
            clear: toolDict.clear || "Clear",
            humanYears: toolDict.humanYears || "Human years",
            lifeStage: toolDict.lifeStage || "Life stage",
            result: toolDict.result || "human years",
            lifeExpectancy: toolDict.lifeExpectancy || "Life expectancy",
            puppy: toolDict.puppy || "Puppy",
            young: toolDict.young || "Young",
            adult: toolDict.adult || "Adult",
            senior: toolDict.senior || "Senior",
            geriatric: toolDict.geriatric || "Geriatric",
          }}
        />
      );
    case "roman-numerals":
      return (
        <RomanNumeralsCalculator
          dictionary={{
            title: toolDict.title || "Roman Numerals",
            subtitle: toolDict.subtitle || "Convert between Arabic and Roman numerals",
            arabicToRoman: toolDict.arabicToRoman || "Arabic → Roman",
            romanToArabic: toolDict.romanToArabic || "Roman → Arabic",
            inputArabic: toolDict.inputArabic || "Arabic number (1-3999)",
            inputRoman: toolDict.inputRoman || "Roman numeral",
            placeholderArabic: toolDict.placeholderArabic || "e.g. 2024",
            placeholderRoman: toolDict.placeholderRoman || "e.g. MMXXIV",
            result: toolDict.result || "Result",
            copy: toolDict.copy || "Copy",
            copied: toolDict.copied || "Copied!",
            clear: toolDict.clear || "Clear",
            invalidNumber: toolDict.invalidNumber || "Enter a number from 1 to 3999",
            invalidRoman: toolDict.invalidRoman || "Invalid Roman numeral",
            referenceTable: toolDict.referenceTable || "Reference table",
          }}
        />
      );
    case "cat-years-calculator":
      return (
        <CatYearsCalculator
          dictionary={{
            title: toolDict.title || "Cat Years Calculator",
            subtitle: toolDict.subtitle || "Convert cat age to human years",
            catAge: toolDict.catAge || "Cat age (years)",
            calculate: toolDict.calculate || "Calculate age",
            clear: toolDict.clear || "Clear",
            humanYears: toolDict.humanYears || "Human years",
            lifeStage: toolDict.lifeStage || "Life stage",
            result: toolDict.result || "human years",
            lifeExpectancy: toolDict.lifeExpectancy || "Life expectancy",
            indoor: toolDict.indoor || "Indoor cat",
            outdoor: toolDict.outdoor || "Outdoor cat",
            kitten: toolDict.kitten || "Kitten",
            junior: toolDict.junior || "Junior",
            adult: toolDict.adult || "Adult",
            mature: toolDict.mature || "Mature",
            senior: toolDict.senior || "Senior",
            geriatric: toolDict.geriatric || "Geriatric",
          }}
        />
      );

    default:
      return <ToolPlaceholder name={toolDict?.name || toolId} />;
  }
}
