# Contributing to Uganda Location Selector

Thank you for your interest in contributing to the Uganda Location Selector library! This project aims to provide accurate, comprehensive location data for Uganda based on official Electoral Commission boundaries.

## Project Overview

The Uganda Location Selector is a JavaScript library that provides hierarchical location selection for Uganda, covering all administrative divisions from districts down to electoral areas. The library is designed to be used in web applications, mobile apps, and server-side projects that need precise Uganda location data.

## How to Contribute

### Reporting Issues

If you find any issues with the data accuracy, missing locations, or bugs in the library, please open an issue on GitHub with the following information:

**For Data Issues:**
- Specific location that appears incorrect
- Expected vs actual data
- Source of correct information (if available)
- Screenshots or examples if applicable

**For Bug Reports:**
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Browser/Node.js version
- Code examples demonstrating the issue

### Suggesting Enhancements

We welcome suggestions for new features or improvements. When suggesting enhancements, please provide:

- Clear description of the proposed feature
- Use case or problem it solves
- Example implementation (if applicable)
- Consideration of backward compatibility

### Data Updates

The electoral data in this library is based on official Uganda Electoral Commission sources. If you have access to more recent or accurate data, please:

- Provide the official source of the updated data
- Explain what has changed
- Include documentation or verification of the changes
- Consider the impact on existing users

## Development Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Git for version control

### Local Development

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/uganda-location-selector.git
   cd uganda-location-selector
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Make your changes and test them:
   ```bash
   npm test
   ```

5. Test the library in a browser environment:
   ```bash
   npm run serve
   ```

### Code Style

- Use clear, descriptive variable and function names
- Include JSDoc comments for all public methods
- Follow existing code formatting and style
- Ensure backward compatibility when possible
- Write tests for new functionality

### Testing

Before submitting changes, please ensure:

- All existing tests pass
- New functionality includes appropriate tests
- The library works in both browser and Node.js environments
- Documentation is updated to reflect changes

## Submitting Changes

### Pull Request Process

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with clear messages:
   ```bash
   git commit -m "Add support for new electoral boundaries"
   ```

3. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a pull request on GitHub with:
   - Clear description of changes
   - Reference to any related issues
   - Screenshots or examples if applicable
   - Confirmation that tests pass

### Review Process

All pull requests will be reviewed by the maintainer (Allan Tumuhimbise). The review process includes:

- Code quality and style review
- Testing of functionality
- Documentation review
- Consideration of backward compatibility
- Verification of data accuracy (for data-related changes)

## Data Sources and Accuracy

This library uses official data from the Uganda Electoral Commission. When contributing data updates:

- Always cite official sources
- Verify accuracy through multiple sources when possible
- Consider the impact on existing applications
- Document any changes in the changelog

## Community Guidelines

- Be respectful and constructive in all interactions
- Focus on the technical aspects of contributions
- Help others learn and improve
- Follow the project's code of conduct

## Recognition

Contributors will be recognized in the project documentation and changelog. Significant contributions may result in collaborator access to the repository.

## Questions and Support

If you have questions about contributing, please:

- Check existing issues and documentation first
- Open a new issue for discussion
- Contact the maintainer directly for sensitive matters

## License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.

Thank you for helping make Uganda location data more accessible and accurate for developers!
