package main

import (
	"fmt"
	"flag"
	"io/ioutil"
   	"log"
   	"net/http"
   	"time"
   	"sort"
   	"math"
)

func main() {

	// flags
	urlPtr := flag.String("url", "", "The url of the site you'd like to visit")
	helpPtr := flag.Bool("help", false, "Help using this tool")
	profilePtr := flag.Int("profile", 1, "Make this number of requests to the url")

	flag.Parse()

    if *helpPtr {
    	fmt.Println("Enter something like: go run hello.go --url=https://royal-limit-f596.elibailey.workers.dev/links")
    	fmt.Println()
    }

    if *urlPtr != "" {

    	//store outcomes
    	times := make([]int, *profilePtr)
    	errorCodes := []int{}
    	numFail := 0
    	smallestSize := math.MaxInt8
    	largestSize := -smallestSize - 1
    	

    	// make requests
    	for x := 0; x < *profilePtr; x++ {

	    	startTime := time.Now()
			resp, err := http.Get(*urlPtr)
			duration := time.Now().Sub(startTime)
			
			// fmt.Println("Duration", duration)

			msTime := int(duration / time.Millisecond)
			times[x] = msTime
			
			if err != nil || resp.StatusCode != 200 {
				numFail += 1
			    log.Fatalln(err)
			    errorCodes = append(errorCodes, resp.StatusCode)
			}

			defer resp.Body.Close()

			//Read the response body
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
			    log.Fatalln(err)
			}

			//Convert the body to type string
			sb := string(body)
		   	log.Printf(sb)

		   	// size of response (in bytes)
		   	if len(body) > largestSize {
		   		largestSize = len(body)
		   	}
		   	if len(body) < smallestSize {
		   		smallestSize = len(body)
		   	}
	   	}

	   	// print outcomes
	   	fmt.Println()

	   	fmt.Println("URL:", *urlPtr)

	   	// num requests
	   	fmt.Println(*profilePtr, "Request(s)")

	   	// min, max, mean, medium
	   	min, max, mean := MinMaxMean(times)
	   	fmt.Println("Fastest Time (ms):", min)
	   	fmt.Println("Slowest Time (ms):", max)
	   	fmt.Println("Mean Time (ms):", mean)
	   	median := Median(times)
	   	fmt.Println("Median Time (ms):", median)

	   	// percent successful
	   	fmt.Println(((*profilePtr - numFail) / *profilePtr) * 100, "percent successful")

	   	if numFail > 0 {
	   		fmt.Println("Error Codes:", errorCodes)
	   	}

	   	// largest and smallest responses
	   	fmt.Println("Largest Response (bytes):", largestSize)
	   	fmt.Println("Smallest Response (bytes):", smallestSize)

   	} else {
   		fmt.Println("Reenter your command followed by a url")

   	}
}

// Returns the min, max, and mean values from an integer array
func MinMaxMean(array []int) (int, int, int) {
    var max int = array[0]
    var min int = array[0]
    total := 0
    for _, value := range array {
        if max < value {
            max = value
        }
        if min > value {
            min = value
        }
        total += value
    }
    return min, max, total / len(array)
}

// Returns the median of an integer array
func Median(array []int) (int) {
	sort.Ints(array)

	middle := len(array) / 2

	if len(array) % 2 != 0 {
		return array[middle]
	}

	return (array[middle - 1] + array[middle]) / 2
}